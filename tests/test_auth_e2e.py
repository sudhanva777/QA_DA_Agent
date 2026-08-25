import os
import unittest
import uuid
from fastapi.testclient import TestClient

from api import app
from src.services.auth import hash_password, verify_password, create_access_token, decode_token

class TestAuthEndToEnd(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.test_email = f"authtest_{uuid.uuid4().hex[:8]}@example.com"
        cls.test_password = "SecurePassword123!"
        cls.test_name = "Automated Test User"
        cls.access_token = None

    def test_01_password_hashing_and_verification(self):
        """Verify native bcrypt hashing and password verification works reliably."""
        password = "MyTestPassword123!"
        hashed = hash_password(password)
        self.assertTrue(hashed.startswith("$2b$") or hashed.startswith("$2a$"))
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("WrongPassword!", hashed))

    def test_02_jwt_token_generation_and_decoding(self):
        """Verify JWT access token creation and payload decoding."""
        user_uuid = str(uuid.uuid4())
        token = create_access_token({"sub": user_uuid, "email": "test@domain.com"})
        self.assertIsInstance(token, str)
        payload = decode_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload.get("sub"), user_uuid)
        self.assertEqual(payload.get("email"), "test@domain.com")
        self.assertIn("exp", payload)

    def test_03_register_validation_errors(self):
        """Verify registration rejects invalid payloads with 422."""
        # Short password (< 8 chars)
        res = self.client.post("/api/auth/register", json={
            "name": "User",
            "email": "valid@example.com",
            "password": "short"
        })
        self.assertEqual(res.status_code, 422)

        # Invalid email format
        res = self.client.post("/api/auth/register", json={
            "name": "User",
            "email": "not-an-email",
            "password": "ValidPassword123!"
        })
        self.assertEqual(res.status_code, 422)

    def test_04_register_success(self):
        """Verify successful user registration returns 201 and valid token."""
        res = self.client.post("/api/auth/register", json={
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data.get("success"))
        self.assertIn("user", data)
        self.assertIn("token", data)
        self.assertEqual(data["user"]["email"], self.test_email.lower())
        self.assertEqual(data["user"]["name"], self.test_name)
        self.assertIn("access_token", data["token"])
        TestAuthEndToEnd.access_token = data["token"]["access_token"]

    def test_05_register_duplicate_email(self):
        """Verify duplicate email registration is rejected with 400."""
        res = self.client.post("/api/auth/register", json={
            "name": "Duplicate User",
            "email": self.test_email.upper(),  # Test case-insensitivity on check
            "password": "AnotherPassword123!"
        })
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertIn("already exists", str(data.get("detail", "")))

    def test_06_login_success(self):
        """Verify login with correct credentials returns 200 and access token."""
        res = self.client.post("/api/auth/login", json={
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))
        self.assertIn("token", data)
        self.assertIn("access_token", data["token"])

    def test_07_login_case_insensitive_email(self):
        """Verify login email lookup is case-insensitive."""
        res = self.client.post("/api/auth/login", json={
            "email": self.test_email.upper(),
            "password": self.test_password
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))

    def test_08_login_wrong_password(self):
        """Verify login rejection with incorrect password."""
        res = self.client.post("/api/auth/login", json={
            "email": self.test_email,
            "password": "IncorrectPassword123!"
        })
        self.assertEqual(res.status_code, 401)

    def test_09_login_nonexistent_email(self):
        """Verify login rejection for non-existent user."""
        res = self.client.post("/api/auth/login", json={
            "email": "nonexistent_user_99999@example.com",
            "password": "AnyPassword123!"
        })
        self.assertEqual(res.status_code, 401)

    def test_10_protected_me_endpoint_with_valid_token(self):
        """Verify /api/auth/me returns user details when authorized."""
        headers = {"Authorization": f"Bearer {self.access_token}"}
        res = self.client.get("/api/auth/me", headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["email"], self.test_email.lower())
        self.assertEqual(data["name"], self.test_name)
        self.assertTrue(data["is_active"])

    def test_11_protected_me_endpoint_unauthorized(self):
        """Verify /api/auth/me returns 401 without token or with invalid token."""
        # Missing token
        res = self.client.get("/api/auth/me")
        self.assertEqual(res.status_code, 401)

        # Malformed / invalid token
        res = self.client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.fake.token"})
        self.assertEqual(res.status_code, 401)

    def test_12_logout_endpoint(self):
        """Verify logout endpoint responds successfully."""
        res = self.client.post("/api/auth/logout")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))

if __name__ == "__main__":
    unittest.main()
