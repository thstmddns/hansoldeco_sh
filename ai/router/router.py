import os
import json
import logging
from fastapi import APIRouter, Body, Form, UploadFile, HTTPException
import requests
import io
from datetime import datetime

from fastapi.responses import FileResponse
from service.answer import create_answer

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/hansol_deco_chatbot")
async def chatbot(text: str = Form(...), chat_id: str = Form(...)):
    try:
        os.makedirs(f"chat_logs/{chat_id}", exist_ok=True)
        answer, vis = create_answer(text, chat_id)
        return {"answer": answer, "visualize": vis}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal server error")