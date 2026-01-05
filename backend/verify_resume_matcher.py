import sys
import os
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

# Ensure we can import main
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def test_analyze_resume():
    print("Starting verification test...")
    # Mock Gemini
    with patch('main.model.generate_content') as mock_generate:
        mock_response = MagicMock()
        mock_response.text = '{"match_score": 85, "missing_keywords": ["python", "fastapi"], "advice": "Good match"}'
        mock_generate.return_value = mock_response

        # Mock PDF Reading
        with patch('main.pypdf.PdfReader') as mock_reader:
            mock_page = MagicMock()
            mock_page.extract_text.return_value = "This is a resume text content."
            mock_reader.return_value.pages = [mock_page]

            # Prepare data
            pdf_content = b"%PDF-1.4 mock pdf content" 
            files = {'resume': ('resume.pdf', pdf_content, 'application/pdf')}
            data = {'job_description': 'Looking for a python developer.'}

            print("Sending POST request to /api/analyze-resume...")
            response = client.post("/api/analyze-resume", files=files, data=data)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {response.json()}")
            
            assert response.status_code == 200
            json_resp = response.json()
            assert "match_score" in json_resp
            assert "missing_keywords" in json_resp
            assert "advice" in json_resp
            assert json_resp["match_score"] == 85
            
            print("Verification PASSED!")

if __name__ == "__main__":
    try:
        test_analyze_resume()
    except Exception as e:
        print(f"Verification FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
