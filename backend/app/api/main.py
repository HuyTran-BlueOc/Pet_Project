from fastapi import APIRouter

from app.api.routes import login, private, users, utils
from app.core.config import settings
from backend.app.api.routes import tasks

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(tasks.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
