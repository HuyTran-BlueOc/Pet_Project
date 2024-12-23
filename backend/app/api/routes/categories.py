import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Categories, CategoryPublic, CategoriesPublic, CategoriesUpdate, CategoriesCreate, Message

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryPublic)
def create_categories(*, session: SessionDep, categories_in: CategoriesCreate) -> Any:
    """
    Create new category
    """
    # Tạo đối tượng Categories từ CategoriesCreate
    category = Categories.model_validate(categories_in)

    # Thêm category vào session và commit vào cơ sở dữ liệu
    session.add(category)
    session.commit()
    session.refresh(category)

    return category

@router.get('/',response_model=CategoriesPublic)
def read_category(
    session: SessionDep, skip: int = 0, limit: int = 100
) -> Any: 
    """
    Retrieve Category 
    """
  # Sum number of categories
    cont_statement = select(func.count()).select_from(Categories)
    count = session.exec(cont_statement).one()

  # Get a paginated list of categories
    statement = select(Categories).offset(skip).limit(limit)
    categories = session.exec(statement).all()

  # return about result 
    return CategoriesPublic(data=categories, count=count)

@router.get('/{id}',response_model=CategoryPublic)
def read_category(session: SessionDep, id: uuid.UUID) -> Any:
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
    session: SessionDep, id: uuid.UUID) -> Message: 
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