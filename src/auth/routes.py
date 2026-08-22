from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user, get_db
from src.models.user import User
from src.schemas.auth import AuthResponse, MessageResponse, UserLogin, UserRegister, UserResponse
from src.services.auth import authenticate_user, logout_user, register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister):
    result = register_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
    )
    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.error,
        )
    return result


@router.post("/login", response_model=AuthResponse)
def login(credentials: UserLogin):
    result = authenticate_user(
        email=credentials.email,
        password=credentials.password,
    )
    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.error,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return result


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    result = logout_user()
    return MessageResponse(**result)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )