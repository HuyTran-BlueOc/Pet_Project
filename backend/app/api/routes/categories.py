import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException, Path
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Categories, CategoryPublic, CategoriesPublic, CategoriesUpdate, CategoriesCreate, Message, Task  

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryPublic)
def create_categories(
    *, 
    session: SessionDep, 
    current_user: CurrentUser, 
    categories_in: CategoriesCreate
) -> Any:
    """
    Create new category
    """
    # Create a Categories object from CategoriesCreate, add owner_id from current_user
    category = Categories.model_validate(categories_in, update={"owner_id": current_user.id})

    # Add the category to the session and commit to the database
    session.add(category)
    session.commit()
    session.refresh(category)

    return category

@router.get("/category/{id}/task", response_model=List[Task])
def get_tasks_by_category(*,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser
) -> Any: 
    """
    Read Category Task
    """
    # Query tasks with categories_id = id
    tasks = session.query(Task).filter(Task.categories_id == id).all()

    # If no tasks found, return a 404 error
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found for the given category ID")
    
    # Check permissions: if user is not a superuser and not the owner of any task
    for task in tasks:
        if not current_user.is_superuser and task.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
    
    return tasks




@router.get('/', response_model=CategoriesPublic)
def read_category(
    session: SessionDep, 
    current_user: CurrentUser,
    skip: int = 0, 
    limit: int = 100
) -> Any: 
    """
    Retrieve Category 
    """
    # Sum the number of categories
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Categories)
        count = session.execute(count_statement).scalar_one()
        statement = select(Categories).offset(skip).limit(limit)
        categories = session.execute(statement).scalars().all()
    else:
        # Get a paginated list of categories for the current user
        count_statement = select(func.count()).select_from(Categories).where(Categories.owner_id == current_user.id)
        count = session.execute(count_statement).scalar_one()
        statement = select(Categories).where(Categories.owner_id == current_user.id).offset(skip).limit(limit)
        categories = session.execute(statement).scalars().all()

    # Return the result
    return CategoriesPublic(data=categories, count=count)

@router.get('/{id}', response_model=CategoryPublic)
def read_category(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
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
    id: uuid.UUID,
    current_user: CurrentUser,
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
def delete_category( 
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message: 
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
