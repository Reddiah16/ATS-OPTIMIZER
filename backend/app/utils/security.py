import html
import re


def sanitize_input(text: str) -> str:
    """
    Sanitize text input to prevent XSS (Cross-Site Scripting).
    Strips script tags, HTML tags, and HTML-escapes special characters.
    """
    if not text:
        return ""
    # Strip script tags and their content
    text = re.sub(r"<script.*?>.*?</script>", "", text, flags=re.IGNORECASE)
    # Strip any remaining HTML tags
    text = re.sub(r"<[^>]*>", "", text)
    # Escape HTML special chars
    return html.escape(text.strip())


def detect_prompt_injection(text: str) -> bool:
    """
    Check if the input text contains patterns indicating prompt injection attempts
    (e.g., trying to override system prompts or bypass instructions).
    """
    if not text:
        return False
    
    # Common prompt injection triggers/phrases
    patterns = [
        r"\bignore\s+(all\s+)?previous\s+instructions\b",
        r"\bignore\s+(all\s+)?above\s+instructions\b",
        r"\bsystem\s+override\b",
        r"\byou\s+are\s+now\s+a\s+chatbot\b",
        r"\bforget\s+(everything\s+)?you\s+know\b",
        r"\bacting\s+as\s+a\b",
        r"\bdisregard\s+(all\s+)?instructions\b",
        r"\bnew\s+role\b",
        r"\bprompt\s+leak\b"
    ]
    
    normalized = text.lower()
    for pattern in patterns:
        if re.search(pattern, normalized):
            return True
    return False


def validate_file_content_signature(content: bytes) -> tuple[bool, str]:
    """
    Inspect the file magic numbers (first few bytes) to verify it is actually a valid PDF or DOCX file.
    Returns (is_valid, detected_file_type).
    """
    if len(content) < 4:
        return False, ""
    
    # PDF Magic Number: %PDF- (hex: 25 50 44 46)
    if content.startswith(b"%PDF-"):
        return True, "pdf"
    
    # DOCX/DOC (ZIP file signature): PK\x03\x04 (hex: 50 4B 03 04)
    if content.startswith(b"PK\x03\x04"):
        return True, "docx"
        
    return False, ""
