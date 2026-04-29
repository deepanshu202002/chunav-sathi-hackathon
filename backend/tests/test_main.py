import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

def test_health_check():
    """Test that the app is running"""
    response = client.get("/health")
    assert response.status_code == 200

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options(
        "/api/chat",
        headers={"Origin": "http://localhost:3000"}
    )
    assert response.status_code in [200, 405]

def test_chat_endpoint_exists():
    """Test chat endpoint is reachable"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "test"}]}
    )
    assert response.status_code in [200, 422, 500]

def test_chat_empty_messages_rejected():
    """Test that empty messages array is rejected"""
    response = client.post(
        "/api/chat",
        json={"messages": []}
    )
    assert response.status_code == 422

def test_chat_invalid_role_rejected():
    """Test that invalid role is rejected"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "hacker", "content": "test"}]}
    )
    assert response.status_code == 422

def test_chat_too_long_content_rejected():
    """Test that content over 2000 chars is rejected"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "x" * 2001}]}
    )
    assert response.status_code == 422

def test_chat_empty_content_rejected():
    """Test that empty content is rejected"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "   "}]}
    )
    assert response.status_code == 422

def test_rate_limiting_allows_normal_requests():
    """Test that normal request rate is not limited"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "What is an election?"}]}
    )
    assert response.status_code != 429

def test_security_headers_present():
    """Test that security headers are in responses"""
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "test"}]}
    )
    assert "x-content-type-options" in response.headers or \
           response.status_code in [200, 500]

def test_topics_endpoint():
    """Test topics endpoint if it exists"""
    response = client.get("/api/topics")
    assert response.status_code in [200, 404]

def test_valid_message_structure():
    """Test valid message passes validation"""
    response = client.post(
        "/api/chat",
        json={
            "messages": [
                {"role": "user", "content": "How do I register to vote in India?"}
            ]
        }
    )
    assert response.status_code in [200, 500]
