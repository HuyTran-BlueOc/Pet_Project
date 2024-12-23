import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Categories, CategoryPublic, CategoriesPublic, CategoriesUpdate, CategoriesCreate, Message

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryPublic)
def create_categories(*, session: SessionDep, current_user: CurrentUser, categories_in: CategoriesCreate) -> Any:
    """
    Create new category
    """
    # Tạo đối tượng Categories từ CategoriesCreate
    category = Categories.model_validate(categories_in, current_user)

    # Thêm category vào session và commit vào cơ sở dữ liệu
    session.add(category)
    session.commit()
    session.refresh(category)

    return category


@router.get('/',response_model=CategoriesPublic)
def read_category(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any: 
    """
    Retrieve Category 
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Categories)
        count = session.exec(count_statement).one()
        statement = select(Categories).offset(skip).limit(limit)
        categories = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Categories)
            .where( current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Categories)
            .where( current_user.id)
            .offset(skip)
            .limit(limit)
        )
        Categories = session.exec(statement).all()

  # return about result 
    return CategoriesPublic(data=categories, count=count)

@router.get('/{id}',response_model=CategoryPublic)
def read_category(session: SessionDep, current_user: CurrentUser , id: uuid.UUID) -> Any:
    """
    Get category by ID 
    """
    category = session.get(Categories, id)
    if not category: 
        raise HTTPException(status_code=404, detail="Category Not Found")
    return category

@router.put("/{id}", response_model=CategoryPublic)
def update_category(
    *, session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    category_in: CategoriesUpdate,
) -> Any: 
    """
    Update an Category
    """
    category = session.get(Categories, id)
    if not category:
        raise HTTPException(status_code=404, detail="Category Not Found")
    update_dict = category_in.model_dump(exclude_unset=True)
    category.sqlmodel_update(update_dict)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@router.delete('/{id}')
def delete_category( 
    session: SessionDep, current_user: CurrentUser , id: uuid.UUID) -> Message: 
    """
    Delete an Category
    """
    category = session.get(Categories,id)
    if not category:
        raise HTTPException(status_code=404, detail="Category Not Found")
    session.delete(category)
    session.commit()
    return Message(message="Category delete successfully")

@router.delete("/")
def delte_categories( session: SessionDep ) -> Message:
    """
    Delete All Categories
    """
    statement = select(Categories)
    categories = session.exec(statement).all()

    if not categories:
        raise HTTPException(status_code=404, detail="No Categories To Delete")
    
    for category in categories:
        session.delete(category)

    session.commit()
    return Message(message="All categories deleted successfully")