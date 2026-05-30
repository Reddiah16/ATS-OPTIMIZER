import re
import math
from typing import List, Tuple, Dict, Any
from collections import Counter
from loguru import logger

# Tech skills & keywords dictionary for extraction
TECH_SKILLS = {
    "programming": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl",
    ],
    "web": [
        "react", "next.js", "nextjs", "vue", "angular", "svelte", "node.js", "nodejs",
        "express", "fastapi", "django", "flask", "spring", "rails", "laravel",
        "html", "css", "tailwind", "bootstrap", "graphql", "rest", "restful",
    ],
    "data": [
        "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
        "sqlite", "cassandra", "dynamodb", "firebase", "supabase",
        "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras",
        "spark", "hadoop", "kafka", "airflow", "dbt",
    ],
    "cloud": [
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
        "ci/cd", "github actions", "jenkins", "linux", "bash", "shell",
        "s3", "ec2", "lambda", "cloudfront", "rds",
    ],
    "tools": [
        "git", "github", "gitlab", "jira", "confluence", "figma", "postman",
        "swagger", "grafana", "prometheus", "datadog", "sentry",
    ],
    "soft": [
        "leadership", "communication", "teamwork", "agile", "scrum", "kanban",
        "problem-solving", "collaboration", "mentoring", "project management",
    ],
}

# Flatten all skills into a searchable set
ALL_KNOWN_SKILLS = set()
for category_skills in TECH_SKILLS.values():
    ALL_KNOWN_SKILLS.update(category_skills)

# Stop words to filter from keyword extraction
STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "need", "dare",
    "this", "that", "these", "those", "i", "you", "he", "she", "it", "we",
    "they", "me", "him", "her", "us", "them", "my", "your", "his", "our",
    "their", "what", "which", "who", "whom", "whose", "when", "where",
    "why", "how", "all", "each", "every", "both", "few", "more", "most",
    "other", "some", "such", "no", "not", "only", "same", "so", "than",
    "too", "very", "just", "also", "about", "above", "after", "before",
    "between", "during", "into", "through", "under", "over", "experience",
    "work", "working", "worked", "using", "use", "used", "including",
    "responsible", "responsibilities", "position", "role", "team", "company",
    "year", "years", "month", "months", "new", "strong", "good", "excellent",
    "required", "requirements", "preferred", "qualifications",
}


def normalize_text(text: str) -> str:
    """Normalize text for comparison."""
    text = text.lower()
    text = re.sub(r"[^\w\s\.\+\#]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def get_term_weight(term: str) -> float:
    """
    Get domain-specific importance weight for a term:
    - Core technical skills: 2.0
    - Tools & platforms: 1.5
    - Soft skills: 1.0
    - Generic keywords: 0.5
    """
    term = term.lower()
    
    # 1. Core technical skills (Programming, Web, Data, Cloud)
    for category in ["programming", "web", "data", "cloud"]:
        if term in TECH_SKILLS[category]:
            return 2.0
            
    # 2. Tools & Platforms
    if term in TECH_SKILLS["tools"]:
        return 1.5
        
    # 3. Soft skills
    if term in TECH_SKILLS["soft"]:
        return 1.0
        
    # 4. Generic/Default keyword
    return 0.5


def compute_cosine_similarity(resume_terms: List[str], jd_terms: List[str]) -> float:
    """
    Compute domain-weighted Cosine Similarity between resume and JD keyword vectors.
    """
    if not resume_terms or not jd_terms:
        return 0.0

    resume_counts = Counter(k.lower() for k in resume_terms)
    jd_counts = Counter(k.lower() for k in jd_terms)

    resume_total = sum(resume_counts.values())
    jd_total = sum(jd_counts.values())

    if resume_total == 0 or jd_total == 0:
        return 0.0

    # Calculate weighted vectors
    # We use Term Frequency (count / total_terms) multiplied by the domain weight
    resume_vector = {
        term: (count / resume_total) * get_term_weight(term)
        for term, count in resume_counts.items()
    }
    jd_vector = {
        term: (count / jd_total) * get_term_weight(term)
        for term, count in jd_counts.items()
    }

    # Calculate dot product
    dot_product = sum(resume_vector.get(t, 0.0) * jd_vector.get(t, 0.0) for t in jd_vector)

    # Calculate magnitudes
    resume_magnitude = math.sqrt(sum(val ** 2 for val in resume_vector.values()))
    jd_magnitude = math.sqrt(sum(val ** 2 for val in jd_vector.values()))

    if resume_magnitude == 0.0 or jd_magnitude == 0.0:
        return 0.0

    return dot_product / (resume_magnitude * jd_magnitude)



def extract_keywords(text: str, min_length: int = 3) -> List[str]:
    """
    Extract meaningful keywords from text.
    Filters out stop words and very short words.
    """
    normalized = normalize_text(text)
    words = normalized.split()

    # Single-word keywords
    keywords = set()
    for word in words:
        if (
            len(word) >= min_length
            and word not in STOP_WORDS
            and not word.isdigit()
        ):
            keywords.add(word)

    # Multi-word skill phrases (bi-grams)
    for i in range(len(words) - 1):
        bigram = f"{words[i]} {words[i+1]}"
        if bigram in ALL_KNOWN_SKILLS:
            keywords.add(bigram)

    return list(keywords)


def extract_skills(text: str) -> List[str]:
    """Extract recognized technical and soft skills from text."""
    normalized = normalize_text(text)
    found_skills = []

    for skill in ALL_KNOWN_SKILLS:
        # Check for whole-word match using word boundaries
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, normalized):
            found_skills.append(skill)

    return found_skills


def compute_keyword_overlap(
    resume_keywords: List[str], jd_keywords: List[str]
) -> Tuple[List[str], List[str], float]:
    """
    Compute keyword overlap between resume and job description.
    Returns (matched, missing, match_percentage).
    """
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)

    matched = list(resume_set & jd_set)
    missing = list(jd_set - resume_set)
    
    if not jd_set:
        return matched, missing, 0.0
    
    match_pct = len(matched) / len(jd_set) * 100
    return matched, missing, round(match_pct, 1)


def score_keyword_match(resume_keywords: List[str], jd_keywords: List[str]) -> Tuple[float, float]:
    """
    Score keyword match using Cosine Similarity.
    Returns (keyword_score_out_of_35, similarity_percentage).
    """
    similarity = compute_cosine_similarity(resume_keywords, jd_keywords)
    score = round(min(35.0, similarity * 35.0), 1)
    return score, round(similarity * 100, 1)


def score_skill_match(
    resume_skills: List[str], jd_skills: List[str]
) -> Tuple[float, List[str], List[str]]:
    """Score skill overlap using Cosine Similarity and return matched/missing skills. Score out of 30."""
    resume_skill_set = set(s.lower() for s in resume_skills)
    jd_skill_set = set(s.lower() for s in jd_skills)

    matched = list(resume_skill_set & jd_skill_set)
    missing = list(jd_skill_set - resume_skill_set)

    if not jd_skills:
        return 20.0, matched, missing

    similarity = compute_cosine_similarity(resume_skills, jd_skills)
    raw_score = similarity * 30.0
    return round(raw_score, 1), matched, missing


def score_experience_alignment(resume_text: str, jd_text: str) -> float:
    """
    Score experience alignment based on quantifiable achievements
    and experience indicators. Score out of 20.
    """
    score = 10.0  # Base score

    # Detect quantifiable achievements (numbers, percentages, dollar amounts)
    quantifiers = re.findall(
        r"\b\d+[\.,]?\d*\s*(%|percent|million|billion|k\b|\$|users|customers|revenue)",
        resume_text.lower(),
    )
    score += min(5.0, len(quantifiers) * 1.0)

    # Detect strong action verbs
    action_verbs = [
        "led", "built", "developed", "architected", "designed", "implemented",
        "improved", "increased", "reduced", "managed", "created", "launched",
        "optimized", "automated", "deployed", "scaled", "delivered", "achieved",
    ]
    found_verbs = sum(1 for v in action_verbs if v in resume_text.lower())
    score += min(5.0, found_verbs * 0.5)

    return min(20.0, round(score, 1))


def score_formatting_quality(resume_text: str) -> float:
    """
    Score resume formatting quality based on structure indicators.
    Score out of 15.
    """
    score = 5.0  # Base

    # Check for common section headers
    section_headers = [
        "experience", "education", "skills", "projects", "summary",
        "objective", "certifications", "awards", "publications",
    ]
    found_sections = sum(1 for s in section_headers if s in resume_text.lower())
    score += min(5.0, found_sections * 1.0)

    # Check for contact info indicators
    has_email = bool(re.search(r"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}", resume_text.lower()))
    has_phone = bool(re.search(r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b", resume_text))
    has_linkedin = "linkedin" in resume_text.lower()

    score += (1.5 if has_email else 0)
    score += (1.5 if has_phone else 0)
    score += (1.0 if has_linkedin else 0)

    # Penalize for very short resumes
    word_count = len(resume_text.split())
    if word_count < 100:
        score -= 3.0
    elif word_count > 200:
        score += 1.0

    return min(15.0, max(0.0, round(score, 1)))


def calculate_ats_score(
    resume_text: str,
    job_description: str,
) -> Dict[str, Any]:
    """
    Full ATS scoring pipeline.
    Returns a complete analysis dictionary.
    """
    # Extract keywords and skills from both texts
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(job_description)

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    # Compute keyword overlap
    matched_kw, missing_kw, _ = compute_keyword_overlap(
        resume_keywords, jd_keywords
    )

    # Score each dimension
    keyword_score, kw_match_pct = score_keyword_match(resume_keywords, jd_keywords)
    skill_score, matched_skills, missing_skills = score_skill_match(
        resume_skills, jd_skills
    )
    experience_score = score_experience_alignment(resume_text, job_description)
    formatting_score = score_formatting_quality(resume_text)

    # Total ATS score
    total = keyword_score + skill_score + experience_score + formatting_score
    ats_score = round(min(100.0, total), 1)

    logger.info(
        f"ATS Score: {ats_score} | KW:{keyword_score} SK:{skill_score} "
        f"EX:{experience_score} FMT:{formatting_score}"
    )

    return {
        "ats_score": ats_score,
        "keyword_score": round(keyword_score, 1),
        "skill_score": round(skill_score, 1),
        "experience_score": round(experience_score, 1),
        "formatting_score": round(formatting_score, 1),
        "matched_keywords": sorted(matched_kw[:30]),
        "missing_keywords": sorted(missing_kw[:30]),
        "all_job_keywords": sorted(jd_keywords[:50]),
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills),
        "keyword_match_percentage": kw_match_pct,
    }
