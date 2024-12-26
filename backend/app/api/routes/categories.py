import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException, Path
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Categories, CategoryPublic, CategoriesPublic, CategoriesUpdate, CategoriesCreate, Message, Task  

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("", response_model=CategoryPublic)
def create_categories(
    *, 
    session: SessionDep, 
    current_user: CurrentUser, 
    categories_in: CategoriesCreate
) -> Any:
    """
    Create new category
    """
    # Check if a category with the same title already exists for the user
    existing_category = session.execute(
        select(Categories).where(
            Categories.title == categories_in.title,
            Categories.owner_id == current_user.id
        )
    ).scalar_one_or_none()

    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="A category with this title already exists."
        )

    # Create a Categories object from CategoriesCreate, add owner_id from current_user
    category = Categories.model_validate(categories_in, update={"owner_id": current_user.id})

    # Add the category to the session and commit to the database
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
def read_one_category(session: SessionDep,current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get category by ID 
    """
    category = session.get(Categories, id)
    if not category: 
        raise HTTPException(status_code=404, detail="Category Not Found")
    if not current_user.is_superuser and (category.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return category

@router.put("/{id}", response_model=CategoryPublic)
def update_category(
    *, session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    category_in: CategoriesUpdate,
) -> Any: 
    """
    Update a category
    """
    category = session.get(Categories, id)
    if not category:
        raise HTTPException(status_code=404, detail="Category Not Found")
    if not current_user.is_superuser and (category.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = category_in.model_dump(exclude_unset=True)
    category.sqlmodel_update(update_dict)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@router.delete('/{id}')
def delete_one_category(
    *, session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
) -> Message: 
    """
    Delete a category
    """
    category = session.get(Categories, id)
    if not category:
        raise HTTPException(status_code=404, detail="Category Not Found")
    if not current_user.is_superuser and (category.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(category)
    session.commit()
    return Message(message="Category deleted successfully")

@router.delete("/")
def delete_categories(session: SessionDep, current_user: CurrentUser) -> Message:
    """
    Delete all categories
    """
    # Get the list of all categories
    statement = select(Categories)
    categories = session.exec(statement).all()

    if not categories:
        raise HTTPException(status_code=404, detail="No Categories To Delete")

    # Check the permission of the current_user (only delete if superuser or owner of the category)
    if not current_user.is_superuser:
        for category in categories:
            if category.owner_id != current_user.id:
                raise HTTPException(status_code=400, detail="Not enough permissions to delete this category")

    # Delete all categories
    for category in categories:
        session.delete(category)

    session.commit()
    return Message(message="All categories deleted successfully")
