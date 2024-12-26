from fastapi import APIRouter

from app.api.routes import tasks, login, private, users, utils, categories
from app.core.config import settings
from app.api.routes import tasks

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(tasks.router)
api_router.include_router(categories.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
