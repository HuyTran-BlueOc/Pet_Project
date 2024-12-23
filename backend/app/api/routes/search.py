from fastapi import APIRouter, Query, Depends
from typing import List, Optional, Union
from sqlalchemy.sql import select
from app.models import Item, Categories, CategoriesPublic, ItemsPublic, ItemPublic, CategoryPublic, User
from app.api.deps import SessionDep, CurrentUser

router = APIRouter()

@router.get("/search", response_model=Union[CategoriesPublic, ItemsPublic, dict])
async def search(
    *,
    q: Optional[str] = Query(None, description="Search term for title or description"),
    type: Optional[str] = Query(None, description="Search type: 'item' or 'category'"),
    session: SessionDep = Depends(),
    current_user: User = Depends(CurrentUser),
) -> Union[CategoriesPublic, ItemsPublic, dict]:
    """
    Search API to filter tasks by task name, category name, and task ID range.
    """
    results = []
    
    if type == "item" or type is None:
        query = select(Item).where(
            (Item.title.ilike(f"%{q}%")) | (Item.description.ilike(f"%{q}%"))
        )
        items = session.execute(query).scalars().all()
        results += [ItemPublic.from_orm(item) for item in items]

    if type == "category" or type is None:
        query = select(Categories).where(
            (Categories.title.ilike(f"%{q}%")) | (Categories.description.ilike(f"%{q}%"))
        )
        categories = session.execute(query).scalars().all()
        results += [CategoryPublic.from_orm(category) for category in categories]

    if type == "item":
        return ItemsPublic(data=results, count=len(results))
    elif type == "category":
        return CategoriesPublic(data=results, count=len(results))
    else:
        return {
            "items": ItemsPublic(data=results, count=len(results)),
            "categories": CategoriesPublic(data=results, count=len(results)),
        }