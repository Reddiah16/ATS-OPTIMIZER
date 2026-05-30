import json
from typing import List, Dict, Any, Optional

from groq import AsyncGroq
from loguru import logger

from app.config import settings


class AIService:

    def __init__(self):

        self.client = AsyncGroq(
            api_key=settings.GROQ_API_KEY
        )

        self.model = "llama-3.1-8b-instant"

    # =========================
    # RESUME FEEDBACK
    # =========================

    async def generate_resume_feedback(
        self,
        resume_text: str,
        job_description: str,
        matched_keywords: List[str],
        missing_keywords: List[str],
        ats_score: float,
    ) -> Dict[str, Any]:

        prompt = f"""
You are an expert ATS resume consultant.

Analyze the resume against the job description to evaluate:
1. Standard feedback, strengths, and weaknesses.
2. Google X-Y-Z improved bullet points.
3. Logical & Semantic Competency Alignment:
   - Role Seniority/Complexity Fit (Junior, Mid, Senior fit comparison).
   - Concept/Synonym mappings (equivalent tools/skills).
   - Domain & Industry relevance.
   - Logical Semantic Score (0-100) based on actual conceptual overlap and skill depth.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{job_description[:2000]}

ATS SCORE (Based on strict keywords):
{ats_score}

MATCHED KEYWORDS:
{", ".join(matched_keywords[:15])}

MISSING KEYWORDS:
{", ".join(missing_keywords[:15])}

Return ONLY valid JSON in this exact structure:

{{
  "strengths": [],
  "weaknesses": [],
  "ai_feedback": [
    {{
      "category": "string",
      "original": "string or null",
      "improved": "string or null",
      "explanation": "string"
    }}
  ],
  "improved_bullets": [
    {{
      "original": "string",
      "improved": "string"
    }}
  ],
  "semantic_alignment": {{
    "semantic_score": 85.0,
    "role_fit": {{
      "seniority_alignment": "Junior/Mid/Senior/Expert Match",
      "explanation": "Brief explanation of seniority and complexity fit."
    }},
    "equivalent_skills_matched": [
      {{
        "job_requirement": "name of JD requirement",
        "candidate_equivalent": "candidate's equivalent tool/skill",
        "match_strength": 0.8,
        "reason": "explanation of equivalence"
      }}
    ],
    "competency_gaps": [
      {{
        "competency": "domain topic",
        "priority": "High/Medium/Low",
        "suggestion": "how to bridge it"
      }}
    ]
  }}
}}
"""

        try:

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.4,
                max_tokens=1500
            )

            content = response.choices[0].message.content

            clean = (
                content
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            result = json.loads(clean)

            return result

        except Exception as e:

            logger.error(f"AI feedback error: {e}")

            return self._fallback_feedback(
                missing_keywords,
                ats_score
            )

 
    # =========================
    # BULLET IMPROVER
    # =========================

    async def improve_bullet_point(
        self,
        bullet: str,
        job_context: str
    ) -> str:

        prompt = f"""
Rewrite this resume bullet point professionally.

JOB CONTEXT:
{job_context}

ORIGINAL:
{bullet}

Return ONLY improved bullet.
"""

        try:

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=200
            )

            return response.choices[0].message.content.strip()

        except Exception as e:

            logger.error(
                f"Bullet improvement error: {e}"
            )

            return bullet

    # =========================
    # COVER LETTER
    # =========================

    async def generate_cover_letter(
        self,
        resume_text: str,
        job_description: str,
        job_title: Optional[str] = None,
    ) -> str:

        prompt = f"""
Write a professional cover letter.

JOB TITLE:
{job_title}

JOB DESCRIPTION:
{job_description[:1500]}

RESUME:
{resume_text[:2000]}
"""

        try:

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.6,
                max_tokens=700
            )

            return response.choices[0].message.content.strip()

        except Exception as e:

            logger.error(
                f"Cover letter error: {e}"
            )

            return "Unable to generate cover letter."

    # =========================
    # FALLBACK FEEDBACK
    # =========================

    def _fallback_feedback(
        self,
        missing_keywords: List[str],
        ats_score: float,
    ):

        return {

            "strengths": [
                "Resume parsed successfully",
                "ATS analysis completed",
                "Resume structure detected"
            ],

            "weaknesses": [
                f"ATS score is {ats_score}%",
                "Missing important keywords",
                "Resume lacks quantified metrics"
            ],

            "ai_feedback": [
                {
                    "category": "Keywords",
                    "explanation": f"Add keywords: {', '.join(missing_keywords[:10])}"
                }
            ],

            "improved_bullets": [],
            "semantic_alignment": {
                "semantic_score": round(ats_score, 1),
                "role_fit": {
                    "seniority_alignment": "N/A (Analysis Fallback)",
                    "explanation": "High-level text alignment score has been used. The deep AI role complexity evaluation was temporarily bypassed due to an API timeout."
                },
                "equivalent_skills_matched": [],
                "competency_gaps": [
                    {
                        "competency": "AI Deep Scan",
                        "priority": "Low",
                        "suggestion": "Retry the analysis in a few minutes to trigger deep semantic indexing."
                    }
                ]
            }
        }