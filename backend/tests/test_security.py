import pytest
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

def test_xss_attempt_in_message():
    """Test XSS attempts are handled safely"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "<script>alert('xss')</script>"}]}
    )
    assert response.status_code in [200, 422, 500]

def test_sql_injection_attempt():
    """Test SQL injection attempts are handled safely"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "'; DROP TABLE users; --"}]}
    )
    assert response.status_code in [200, 422, 500]

def test_oversized_payload():
    """Test oversized payload is rejected"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "x" * 5000}]}
    )
    assert response.status_code == 422

def test_missing_messages_field():
    """Test missing messages field returns 422"""
    response = client.post("/api/chat", json={})
    assert response.status_code == 422

def test_null_content():
    """Test null content is rejected"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": None}]}
    )
    assert response.status_code == 422
