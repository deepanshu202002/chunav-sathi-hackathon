import pytest
from unittest.mock import patch, MagicMock, AsyncMock
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_gemini_module_loads():
    """Test gemini module can be imported"""
    try:
        import gemini
        assert True
    except ImportError:
        pytest.skip("Gemini module not available without API key")

def test_sanitize_input_removes_scripts():
    """Test input sanitization removes script tags"""
    from routes.chat import sanitize_input
    dangerous = "<script>alert('xss')</script>Hello"
    result = sanitize_input(dangerous)
    assert "<script>" not in result
    assert "Hello" in result

def test_sanitize_input_truncates_long_input():
    """Test input sanitization truncates at 2000 chars"""
    from routes.chat import sanitize_input
    long_input = "a" * 3000
    result = sanitize_input(long_input)
    assert len(result) <= 2000

def test_sanitize_input_removes_javascript():
    """Test javascript: protocol is removed"""
    from routes.chat import sanitize_input
    dangerous = "javascript:alert(1)"
    result = sanitize_input(dangerous)
    assert "javascript:" not in result

def test_sanitize_input_normal_text():
    """Test normal text passes through sanitization"""
    from routes.chat import sanitize_input
    normal = "How do I register to vote in India?"
    result = sanitize_input(normal)
    assert result == normal
