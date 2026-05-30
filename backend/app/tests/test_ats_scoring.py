import sys
import os
from dotenv import load_dotenv

# Load env variables from backend/.env before importing pydantic settings
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(backend_dir, ".env"))

# Add backend to sys.path to allow absolute imports
sys.path.insert(0, backend_dir)

import unittest
from app.services.ats_service import (
    get_term_weight,
    compute_cosine_similarity,
    calculate_ats_score,
    extract_keywords,
    extract_skills
)

class TestATSScoringEngine(unittest.TestCase):
    
    def test_term_weights(self):
        """Test that get_term_weight assigns the correct domain weights."""
        # Core Technical Skills (Weight 2.0)
        self.assertEqual(get_term_weight("python"), 2.0)
        self.assertEqual(get_term_weight("fastapi"), 2.0)
        self.assertEqual(get_term_weight("postgresql"), 2.0)
        self.assertEqual(get_term_weight("docker"), 2.0)
        
        # Tools & Platforms (Weight 1.5)
        self.assertEqual(get_term_weight("git"), 1.5)
        self.assertEqual(get_term_weight("jira"), 1.5)
        self.assertEqual(get_term_weight("postman"), 1.5)
        
        # Soft Skills (Weight 1.0)
        self.assertEqual(get_term_weight("leadership"), 1.0)
        self.assertEqual(get_term_weight("communication"), 1.0)
        
        # Generic Keywords (Weight 0.5)
        self.assertEqual(get_term_weight("development"), 0.5)
        self.assertEqual(get_term_weight("solutions"), 0.5)
        self.assertEqual(get_term_weight("impact"), 0.5)

    def test_cosine_similarity_identities(self):
        """Test cosine similarity for identity cases (identical, disjoint, and empty)."""
        terms_a = ["python", "fastapi", "docker"]
        terms_b = ["python", "fastapi", "docker"]
        
        # Identical sets
        self.assertAlmostEqual(compute_cosine_similarity(terms_a, terms_b), 1.0)
        
        # Disjoint sets
        terms_c = ["leadership", "communication"]
        self.assertAlmostEqual(compute_cosine_similarity(terms_a, terms_c), 0.0)
        
        # Empty inputs
        self.assertEqual(compute_cosine_similarity([], terms_b), 0.0)
        self.assertEqual(compute_cosine_similarity(terms_a, []), 0.0)
        self.assertEqual(compute_cosine_similarity([], []), 0.0)

    def test_domain_importance_boost(self):
        """Test that matching core technical skills yields a higher similarity than generic terms."""
        # Baseline JD: 1 technical, 1 tool, 1 generic
        jd = ["python", "git", "development"]
        
        # Resume A matches the core technical skill (python)
        resume_tech = ["python"]
        sim_tech = compute_cosine_similarity(resume_tech, jd)
        
        # Resume B matches the generic word (development)
        resume_generic = ["development"]
        sim_generic = compute_cosine_similarity(resume_generic, jd)
        
        # Since Python is weighted 2.0 and development is weighted 0.5,
        # Resume A must have a significantly higher similarity score
        self.assertTrue(sim_tech > sim_generic)
        print(f"\n[Similarity Boost Test] Technical Match Sim: {sim_tech:.3f} | Generic Match Sim: {sim_generic:.3f}")

    def test_full_pipeline_safety(self):
        """Test that the end-to-end calculate_ats_score runs without throwing errors."""
        resume = """
        Experienced Software Engineer skilled in Python, FastAPI, Docker, and PostgreSQL.
        Developed robust backend APIs, automated CI/CD pipelines using Git and GitHub Actions.
        Led agile teams, demonstrated excellent communication and leadership.
        """
        
        jd = """
        Looking for a Senior Backend Developer with expertise in Python, FastAPI, and Docker.
        Should have experience with database systems like PostgreSQL.
        Strong tools experience in Git is required. Good leadership and communication skills.
        """
        
        res = calculate_ats_score(resume, jd)
        
        # Assert keys exist in dictionary
        self.assertIn("ats_score", res)
        self.assertIn("keyword_score", res)
        self.assertIn("skill_score", res)
        self.assertIn("experience_score", res)
        self.assertIn("formatting_score", res)
        self.assertIn("matched_keywords", res)
        self.assertIn("missing_keywords", res)
        self.assertIn("matched_skills", res)
        self.assertIn("missing_skills", res)
        
        # Assert score bounds
        self.assertTrue(0.0 <= res["ats_score"] <= 100.0)
        self.assertTrue(0.0 <= res["keyword_score"] <= 35.0)
        self.assertTrue(0.0 <= res["skill_score"] <= 30.0)
        
        print(f"[Full Pipeline Test] Overall ATS Score: {res['ats_score']}/100")
        print(f"  - Keywords: {res['keyword_score']}/35")
        print(f"  - Skills: {res['skill_score']}/30")
        print(f"  - Experience: {res['experience_score']}/20")
        print(f"  - Formatting: {res['formatting_score']}/15")

if __name__ == "__main__":
    unittest.main()
