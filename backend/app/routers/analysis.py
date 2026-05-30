from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
    AnalysisHistoryResponse,
    RescoreRequest,
    AnalysisComparison,
)
from app.services.analysis_service import AnalysisService
from app.services.ai_service import AIService
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.utils.rate_limiter import RateLimiterDependency

router = APIRouter(prefix="/analysis", tags=["Analysis"])
ai_rate_limiter = RateLimiterDependency(limit=3, window=60, scope="AI")


@router.post("/", response_model=AnalysisResponse, status_code=201)
async def create_analysis(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    _rate_limit = Depends(ai_rate_limiter),
):
    service = AnalysisService(db)
    return await service.run_analysis(request, current_user)


@router.get("/history", response_model=AnalysisHistoryResponse)
def get_history(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AnalysisService(db)
    return service.get_user_history(current_user, skip=skip, limit=limit)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AnalysisService(db)
    return service.get_analysis_by_id(analysis_id, current_user)


@router.post("/{analysis_id}/rescore", response_model=AnalysisResponse)
async def rescore_analysis(
    analysis_id: int,
    request: RescoreRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    _rate_limit = Depends(ai_rate_limiter),
):
    service = AnalysisService(db)
    return await service.rescore_analysis(analysis_id, request, current_user)


@router.get("/{analysis_id}/compare", response_model=AnalysisComparison)
def compare_analyses(
    analysis_id: int,
    other_id: int = Query(..., description="ID of the older analysis to compare against"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AnalysisService(db)
    return service.compare_analyses(analysis_id, other_id, current_user)