from datetime import date, datetime
import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Categories, Message, Task, TaskCreate, TaskPublic, TaskUpdate, TasksPublic

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=TasksPublic)
def get_tasks_by_owner(
    session: SessionDep, 
    current_user: CurrentUser, 
    skip: int = 0, 
    limit: int = 99999
) -> Any:
    try:
        statement = (
            select(Task)
            .where(Task.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        results = session.exec(statement).all()

        count_statement = select(func.count()).where(Task.owner_id == current_user.id).select_from(Task)
        count = session.exec(count_statement).one() 

        return TasksPublic(data=results, count=count)
    except Exception as e:
        session.rollback()  
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.get("/{task_id}", response_model=TaskPublic)
def get_task(session: SessionDep, current_user: CurrentUser, task_id: uuid.UUID ):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if not current_user.is_superuser and task.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
    return task

@router.post("/", response_model=TaskPublic)
def create_task(
    session: SessionDep, 
    current_user: CurrentUser, 
    task: TaskCreate, 
    categories_id: Optional[uuid.UUID] = None
): 
    try: 
        if categories_id:
            category = session.get(Categories, categories_id)
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")

        task_data = task.dict(exclude={"categories_id"})

        new_task = Task(
            **task_data,
            owner_id=current_user.id,
            categories_id=categories_id  
        )

        session.add(new_task)
        session.commit()
        session.refresh(new_task)
        return new_task
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.put('/{task_id}', response_model=TaskPublic)
def update_task(*, session: SessionDep, current_user: CurrentUser, task_id: uuid.UUID,task_update: TaskUpdate, categories_id: Optional[uuid.UUID] = None,):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(task, key, value)

    if categories_id:
        category = session.get(Categories, categories_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        if not current_user.is_superuser and task.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
        task.categories_id = categories_id

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/tasks/{task_id}", response_model=dict)
def delete_task(task_id: uuid.UUID, current_user: CurrentUser, session: SessionDep):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if not current_user.is_superuser and task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(task)
    session.commit()
    return {"detail": "Task deleted successfully"}

@router.patch("/status", response_model=dict)
def update_tasks_status(
    session: SessionDep,
    current_user: CurrentUser,
    task_ids: List[uuid.UUID] = Query(...),
    status: str = Query(...),
):
    """
    Update the status of multiple tasks
    """
    # Fetch tasks matching the provided IDs
    tasks = session.exec(select(Task).where(Task.id.in_(task_ids))).all()

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    # Check permissions for each task
    for task in tasks:
        if not current_user.is_superuser and task.owner_id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough permissions to update task {task.id}",
            )

    # Update the status of tasks
    for task in tasks:
        task.status = status
        task.updated_at = datetime.utcnow()
        session.add(task)

    session.commit()
    return {"detail": f"{len(tasks)} tasks updated successfully"}


@router.delete("/tasks", response_model=dict)
def delete_tasks(task_ids: List[uuid.UUID], session: SessionDep, current_user: CurrentUser):
    # Fetch tasks using the task_ids
    tasks = session.exec(select(Task).where(Task.id.in_(task_ids))).all()

    # If no tasks are found, raise a 404 error
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    # Check permissions: if user is not superuser and not the owner of the task, raise error
    for task in tasks:
        if not current_user.is_superuser and task.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # If permission is valid, delete each task
    for task in tasks:
        session.delete(task)

    # Commit the changes to the database
    session.commit()

    return {"detail": f"{len(tasks)} tasks deleted successfully"}


@router.delete("/tasks/{task_id}/categories", response_model=dict)
def remove_category_from_task(task_id: uuid.UUID, session: SessionDep, current_user: CurrentUser,):
    """
    Xóa liên kết giữa một task và category của nó
    """
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if not task.categories_id:
        raise HTTPException(
            status_code=400,
            detail="Task does not have an associated category",
        )
    if not current_user.is_superuser and task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    task.categories_id = None
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return {"detail": "Category removed from task successfully"}