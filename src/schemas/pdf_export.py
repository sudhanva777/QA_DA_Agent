from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class PDFExportRequest(BaseModel):
    analysis_result: Dict[str, Any] = Field(..., description="The analysis result object from /api/query")
    dataset_name: Optional[str] = Field(None, description="Optional dataset name for filename")


class PDFExportResponse(BaseModel):
    success: bool
    filename: Optional[str] = None
    error: Optional[str] = None