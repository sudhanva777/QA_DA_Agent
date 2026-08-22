from datetime import datetime, timedelta, timezone
from uuid import UUID

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from src.db.postgresql import SessionLocal
from src.models.user import User
from src.schemas.auth import AuthResponse, Token, UserResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def get_secret_key() -> str:
    import os
    return os.environ.get("JWT_SECRET_KEY", SECRET_KEY)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, get_secret_key(), algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None


def register_user(name: str, email: str, password: str) -> AuthResponse:
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return AuthResponse(success=False, error="An account with this email already exists")

        password_hash = hash_password(password)
        new_user = User(
            name=name.strip(),
            email=email.lower().strip(),
            password_hash=password_hash,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        access_token = create_access_token(
            data={"sub": str(new_user.id), "email": new_user.email}
        )

        user_response = UserResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            is_active=new_user.is_active,
            created_at=new_user.created_at,
            updated_at=new_user.updated_at,
        )

        return AuthResponse(
            success=True,
            user=user_response,
            token=Token(access_token=access_token, expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60),
        )
    finally:
        db.close()


def authenticate_user(email: str, password: str) -> AuthResponse:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email.lower().strip()).first()
        if not user:
            return AuthResponse(success=False, error="Invalid email or password")

        if not user.is_active:
            return AuthResponse(success=False, error="Account is deactivated")

        if not verify_password(password, user.password_hash):
            return AuthResponse(success=False, error="Invalid email or password")

        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )

        user_response = UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

        return AuthResponse(
            success=True,
            user=user_response,
            token=Token(access_token=access_token, expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60),
        )
    finally:
        db.close()


def get_user_by_id(user_id: UUID) -> UserResponse | None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        return UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
    finally:
        db.close()


def logout_user() -> dict:
    return {"success": True, "message": "Logged out successfully"}