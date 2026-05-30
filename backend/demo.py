from app.services.ats_service import calculate_ats_score

resume = """
John Doe
john@example.com
555-123-4567

SUMMARY
Senior Software Engineer with 5 years of experience in Python and React.

EXPERIENCE
Google
Software Engineer
- Increased revenue by 50% by implementing a new caching system in Python.
- Built a scalable backend using FastAPI and PostgreSQL, serving 1M requests per day.
- Participated in code reviews.

EDUCATION
MIT - Computer Science
"""

jd = """
Looking for a Senior Software Engineer with strong Python, FastAPI, and React skills. 
Must have experience with PostgreSQL databases and scalable architectures. 
We value strong communication and problem-solving skills.
"""

result = calculate_ats_score(resume, jd)
print("\n=======================================")
print("RESUME IQ - LIVE ATS SCORING DEMO")
print("=======================================")
print(f"Overall ATS Score:   {result['ats_score']}/100")
print("---------------------------------------")
print(f"Keyword Match:       {result['keyword_score']}/35")
print(f"Skill Match:         {result['skill_score']}/30")
print(f"Experience Quality:  {result['experience_score']}/20")
print(f"Formatting:          {result['formatting_score']}/15")
print("---------------------------------------")
print("Matched Keywords:    " + ", ".join(result['matched_keywords']))
print("Missing Skills:      " + ", ".join(result['missing_skills']))
print("=======================================")
