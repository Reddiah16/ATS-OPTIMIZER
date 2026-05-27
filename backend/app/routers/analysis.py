from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
    AnalysisHistoryResponse,
)
from app.services.analysis_service import AnalysisService
from app.services.ai_service import AIService
from app.middleware.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/", response_model=AnalysisResponse, status_code=201)
async def create_analysis(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
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



    return result