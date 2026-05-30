import sys
import os
from dotenv import load_dotenv

# Load env variables from backend/.env before importing pydantic settings
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(backend_dir, ".env"))

# Add backend to sys.path to allow absolute imports
sys.path.insert(0, backend_dir)

import unittest
from app.schemas.analysis import (
    SemanticAlignmentResponse,
    RoleFit,
    EquivalentSkillMatch,
    CompetencyGap,
    AnalysisResponse,
)
from app.services.ai_service import AIService


class TestSemanticAlignmentEngine(unittest.TestCase):

    def test_semantic_alignment_schema_validation(self):
        """Test that semantic alignment schemas validate correctly with valid fields."""
        data = {
            "semantic_score": 85.5,
            "role_fit": {
                "seniority_alignment": "Senior Match",
                "explanation": "Candidate displays 5 years of system design experience.",
            },
            "equivalent_skills_matched": [
                {
                    "job_requirement": "FastAPI",
                    "candidate_equivalent": "Express.js",
                    "match_strength": 0.8,
                    "reason": "Both are high-performance REST microservices frameworks.",
                }
            ],
            "competency_gaps": [
                {
                    "competency": "High throughput microservices",
                    "priority": "High",
                    "suggestion": "Emphasize caching using Redis.",
                }
            ],
        }

        # Validating using Pydantic
        res = SemanticAlignmentResponse(**data)
        self.assertEqual(res.semantic_score, 85.5)
        self.assertEqual(res.role_fit.seniority_alignment, "Senior Match")
        self.assertEqual(res.equivalent_skills_matched[0].job_requirement, "FastAPI")
        self.assertEqual(res.competency_gaps[0].priority, "High")

    def test_fallback_logical_alignment(self):
        """Test that _fallback_feedback generates valid semantic alignment structure."""
        ai_service = AIService()
        fallback = ai_service._fallback_feedback(
            missing_keywords=["kubernetes", "docker"], ats_score=45.0
        )

        self.assertIn("semantic_alignment", fallback)
        sa_data = fallback["semantic_alignment"]

        # Validate with Pydantic
        res = SemanticAlignmentResponse(**sa_data)
        self.assertEqual(res.semantic_score, 45.0)
        self.assertEqual(res.role_fit.seniority_alignment, "N/A (Analysis Fallback)")
        self.assertEqual(len(res.equivalent_skills_matched), 0)


if __name__ == "__main__":
    unittest.main()
