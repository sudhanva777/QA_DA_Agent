import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

import pytest

os.environ['DATABASE_URL'] = 'postgresql://user:pass@localhost:5432/qadata'
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-for-development-only-32chars'
os.environ['GROQ_API_KEY'] = 'test'

from src.services.pdf_generator import (
    generate_analysis_pdf,
    _resolve_chart_path,
    _format_table_data,
    _sanitize_text,
    _sanitize_filename,
)


class TestPDFGenerator(unittest.TestCase):
    def setUp(self):
        self.sample_analysis_result = {
            "dataset_id": "sales_data.csv",
            "question": "What are total sales by region?",
            "answer": "North: $2.4M | South: $1.8M | East: $3.1M | West: $2.7M",
            "explanation": "The data shows sales totals grouped by region.",
            "table": {
                "columns": ["region", "total_sales"],
                "rows": [
                    {"region": "North", "total_sales": 2400000},
                    {"region": "South", "total_sales": 1800000},
                    {"region": "East", "total_sales": 3100000},
                    {"region": "West", "total_sales": 2700000},
                ],
                "shape": [4, 2],
            },
            "chart_url": "/outputs/chart_abc123.png",
            "chart_data": {
                "type": "bar",
                "data": [{"name": "North", "value": 2400000}, {"name": "South", "value": 1800000}],
                "xKey": "name",
                "yKey": "value",
            },
            "generated_code": "result = df.groupby('region')['sales'].sum().sort_values(ascending=False)",
            "analysis_plan": {"step1": "Group by region", "step2": "Sum sales"},
            "latency_ms": 127.45,
            "timestamp": 1724352000.123,
        }

    def test_generate_analysis_pdf_basic(self):
        """Test PDF generation with a normal analysis result."""
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp_path = tmp.name
        try:
            result_path = generate_analysis_pdf(self.sample_analysis_result, tmp_path)
            self.assertEqual(result_path, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
            self.assertGreater(os.path.getsize(tmp_path), 0)
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_generate_analysis_pdf_without_output_path(self):
        """Test PDF generation with auto-generated temp path."""
        result_path = generate_analysis_pdf(self.sample_analysis_result)
        self.assertTrue(os.path.exists(result_path))
        self.assertTrue(result_path.endswith('.pdf'))
        os.unlink(result_path)

    def test_generate_analysis_pdf_without_chart(self):
        """Test PDF generation when chart is missing."""
        result = self.sample_analysis_result.copy()
        result["chart_url"] = None
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp_path = tmp.name
        try:
            result_path = generate_analysis_pdf(result, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_generate_analysis_pdf_with_empty_table(self):
        """Test PDF generation with empty table."""
        result = self.sample_analysis_result.copy()
        result["table"] = {"columns": [], "rows": [], "shape": [0, 0]}
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp_path = tmp.name
        try:
            result_path = generate_analysis_pdf(result, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_generate_analysis_pdf_with_long_answer(self):
        """Test PDF generation with very long answer."""
        result = self.sample_analysis_result.copy()
        result["answer"] = "A" * 5000
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp_path = tmp.name
        try:
            result_path = generate_analysis_pdf(result, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_generate_analysis_pdf_with_long_code(self):
        """Test PDF generation with very long generated code."""
        result = self.sample_analysis_result.copy()
        result["generated_code"] = "\n".join([f"# Line {i}" for i in range(100)])
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp_path = tmp.name
        try:
            result_path = generate_analysis_pdf(result, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_generate_analysis_pdf_with_large_table(self):
        """Test PDF generation with large table (many rows)."""
        result = self.sample_analysis_result.copy()
        result["table"] = {
            "columns": ["id", "value", "category", "date", "amount", "status", "notes", "extra"],
            "rows": [{"id": i, "value": i * 10, "category": f"cat_{i}", "date": "2024-01-01", "amount": 100.50, "status": "active", "notes": "note", "extra": "extra"} for i in range(100)],
            "shape": [100, 8],
        }
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp_path = tmp.name
        try:
            result_path = generate_analysis_pdf(result, tmp_path)
            self.assertTrue(os.path.exists(tmp_path))
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def test_sanitize_text(self):
        self.assertEqual(_sanitize_text("Hello & World"), "Hello & World")
        self.assertEqual(_sanitize_text("<script>"), "<script>")
        self.assertEqual(_sanitize_text(""), "")
        self.assertEqual(_sanitize_text(None), "")

    def test_sanitize_filename(self):
        self.assertEqual(_sanitize_filename("sales data.csv"), "sales_data.csv")
        self.assertEqual(_sanitize_filename("file@#$%^&*()"), "file")
        self.assertEqual(_sanitize_filename("a" * 150), "a" * 100)

    def test_format_table_data(self):
        table = {
            "columns": ["col1", "col2"],
            "rows": [{"col1": "a", "col2": 1}, {"col1": "b", "col2": None}],
        }
        data = _format_table_data(table)
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0], ["col1", "col2"])
        self.assertEqual(data[1], ["a", "1"])
        self.assertEqual(data[2], ["b", ""])

    def test_format_table_data_empty(self):
        self.assertEqual(_format_table_data({}), [])
        self.assertEqual(_format_table_data({"columns": [], "rows": []}), [])

    def test_resolve_chart_path_valid(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir).resolve()
            chart_path = tmpdir_path / "chart_test.png"
            chart_path.write_bytes(b"fake png")
            with patch('src.services.pdf_generator.OUTPUTS_DIR', tmpdir_path):
                result = _resolve_chart_path("/outputs/chart_test.png")
                self.assertIsNotNone(result)
                self.assertTrue(result.exists())

    def test_resolve_chart_path_invalid(self):
        result = _resolve_chart_path(None)
        self.assertIsNone(result)
        result = _resolve_chart_path("/invalid/path")
        self.assertIsNone(result)


class TestPDFExportEndpoint(unittest.TestCase):
    def setUp(self):
        from fastapi.testclient import TestClient
        import api
        from src.auth.dependencies import get_current_user
        from src.models.user import User
        import uuid

        self.app = api.app
        self.client = TestClient(self.app)

        # Create a mock user for testing
        self.mock_user = User(
            id=uuid.uuid4(),
            name="Test User",
            email="test@test.com",
            password_hash="hashed",
            is_active=True,
        )

        def override_get_current_user():
            return self.mock_user

        self.app.dependency_overrides[get_current_user] = override_get_current_user

    def tearDown(self):
        self.app.dependency_overrides.clear()

    def test_export_pdf_without_auth_override(self):
        # Create a new client without auth override
        from fastapi.testclient import TestClient
        import api
        import src.auth.dependencies as auth_deps
        # Clear any existing overrides
        api.app.dependency_overrides.clear()
        client = TestClient(api.app)
        response = client.post('/api/export/pdf', json={"analysis_result": {}})
        self.assertEqual(response.status_code, 401)

    @patch('api.get_current_user')
    @patch('api.generate_analysis_pdf')
    def test_export_pdf_success(self, mock_generate, mock_get_user):
        mock_user = MagicMock()
        mock_user.id = "test-id"
        mock_user.email = "test@test.com"
        mock_user.is_active = True
        mock_get_user.return_value = mock_user

        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp.write(b"%PDF-1.4 test pdf content")
            tmp_path = tmp.name

        mock_generate.return_value = tmp_path

        try:
            response = self.client.post('/api/export/pdf', json={
                "analysis_result": {
                    "dataset_id": "test.csv",
                    "question": "Test question",
                    "answer": "Test answer",
                }
            })
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.headers['content-type'], 'application/pdf')
            self.assertIn('attachment', response.headers['content-disposition'])
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    @patch('api.get_current_user')
    @patch('api.generate_analysis_pdf')
    def test_export_pdf_handles_error(self, mock_generate, mock_get_user):
        mock_user = MagicMock()
        mock_user.id = "test-id"
        mock_user.email = "test@test.com"
        mock_user.is_active = True
        mock_get_user.return_value = mock_user
        mock_generate.side_effect = Exception("PDF generation failed")

        response = self.client.post('/api/export/pdf', json={
            "analysis_result": {"dataset_id": "test.csv"}
        })
        self.assertEqual(response.status_code, 500)

    @patch('api.get_current_user')
    def test_export_pdf_invalid_request(self, mock_get_user):
        mock_user = MagicMock()
        mock_user.id = "test-id"
        mock_user.email = "test@test.com"
        mock_user.is_active = True
        mock_get_user.return_value = mock_user

        response = self.client.post('/api/export/pdf', json={})
        self.assertEqual(response.status_code, 422)


if __name__ == '__main__':
    unittest.main()