import unittest
from app.services.ats_service import (
    calculate_ats_score,
    score_formatting_quality,
)

class TestATSLogic(unittest.TestCase):
    def test_calculate_ats_score_categories(self):
        resume_text = "I am a software engineer with React and Python experience. I accomplished increasing sales by 20% by doing marketing."
        jd_text = "Looking for a software engineer with React and Python skills."
        
        result = calculate_ats_score(resume_text, jd_text)
        
        # Ensure it returns the expected dictionary keys
        self.assertIn("ats_score", result)
        self.assertIn("keyword_score", result)
        self.assertIn("skill_score", result)
        self.assertIn("experience_score", result)
        self.assertIn("formatting_score", result)

    def test_section_diagnostics(self):
        # Missing Education and Headers
        resume_text = "Just some text without proper headers. I worked at Google."
        score = score_formatting_quality(resume_text)
        self.assertTrue(score < 15, "Formatting score should be penalized for missing sections")

        # Has headers
        resume_text_good = "SUMMARY\nSoftware Engineer\nEXPERIENCE\nGoogle\nEDUCATION\nMIT"
        score_good = score_formatting_quality(resume_text_good)
        self.assertTrue(score_good > score, "Formatting score should be higher with proper sections")

    def test_formatting_checks(self):
        # Email and Phone
        resume_text = "John Doe\njohn@example.com\n555-123-4567\nEXPERIENCE"
        score = score_formatting_quality(resume_text)
        
        resume_text_bad = "John Doe\nNo contact info here.\nEXPERIENCE"
        score_bad = score_formatting_quality(resume_text_bad)
        
        self.assertTrue(score > score_bad, "Missing contact info should lower formatting score")

if __name__ == "__main__":
    unittest.main()
