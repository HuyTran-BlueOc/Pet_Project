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
    limit: int = 100,
    search: Optional[str] = None
) -> Any:
    try:
        # Initialize the base filter condition
        filter_condition = Task.owner_id == current_user.id

        # Add search conditions if search is provided
        if search:
            search_filter = (
                (Task.title.ilike(f"%{search}%")) | 
                (Task.description.ilike(f"%{search}%"))
                
            )
            filter_condition = filter_condition & search_filter

        # Query to get tasks along with category (if any)
        statement = (
            select(Task, Categories)  # Select both Task and Categories
            .join(Categories, Task.categories_id == Categories.id, isouter=True)  # Outer join for tasks without categories
            .where(filter_condition)
            .offset(skip)
            .limit(limit)
        )
        results = session.exec(statement).all()

        # Query to count total tasks
        count_statement = select(func.count()).where(filter_condition).select_from(Task)
        task_count = session.execute(count_statement).scalar_one()

        # Map results to include tasks without categories
        tasks = [
            TaskPublic(
                id=result.Task.id,
                owner_id=result.Task.owner_id,
                categories_id=result.Task.categories_id,
                title=result.Task.title,
                description=result.Task.description,
                status=result.Task.status,
                priority=result.Task.priority,
                due_date=result.Task.due_date,
                created_at=result.Task.created_at,
                updated_at=result.Task.updated_at,
                category_title=result.Categories.title if result.Categories else ""  # Check if Categories exists
            )
            for result in results
        ]

        return TasksPublic(data=tasks, count=task_count, task_count=task_count)
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
): 
    try: 
        if task.categories_id:
            category = session.get(Categories, task.categories_id)
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")
            if not current_user.is_superuser and category.owner_id != current_user.id:
                raise HTTPException(status_code=400, detail="Not enough permissions")
        
        task_data = task.dict()

        task_data["categories_id"] = task.categories_id
        # task_data["categories_id"] = categories_id if task.categories_id == "" else task.categories_id

        new_task = Task(
            **task_data,
            owner_id=current_user.id,
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

@router.delete("/{task_id}", response_model=dict)
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


@router.delete("/", response_model=dict)
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


@router.delete("/{task_id}/categories", response_model=dict)
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

@router.delete("/{task_id}/categories", response_model=dict)
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


# ===================
# fix search
# ===================

# @router.get("/search", response_model=List[TasksPublic])
# def search_tasks(
#     session: SessionDep, 
#     title: Optional[str] = Query(None),
#     category_title: Optional[str] = Query(None),
#     status: Optional[str] = Query(None),
#     priority: Optional[str] = Query(None),
#     start_date: Optional[date] = Query(None),
#     end_date: Optional[date] = Query(None),
#     categories_id: Optional[uuid.UUID] = None,
#     current_user: CurrentUser,
# ):
#     try :
#         query = session.query(Task).join(Categories, Task.categories_id == categories_id)

#         # Tìm kiếm theo tiêu đề task hoặc category
#         if title:
#             query = query.filter(func.lower(Task.title).contains(title.lower()))
#         if category_title:
#             query = query.filter(func.lower(Categories.title).contains(category_title.lower()))

#         # Lọc theo trạng thái
#         if status:
#             query = query.filter(Task.status == status)

#         # Lọc theo độ ưu tiên
#         if priority:
#             query = query.filter(Task.priority == priority)

#         # Lọc theo ngày hạn chót
#         if start_date and end_date:
#             query = query.filter(Task.due_date.between(start_date, end_date))
#         elif start_date:
#             query = query.filter(Task.due_date >= start_date)
#         elif end_date:
#             query = query.filter(Task.due_date <= end_date)

#         # Thực thi truy vấn
#         tasks = query.all()
#         if not tasks:
#             raise HTTPException(status_code=404, detail="No tasks found matching the criteria")
#         if not current_user.is_superuser and tasks.owner_id != current_user.id:
#             raise HTTPException(status_code=400, detail="Not enough permissions")
#         return tasks
#     except Exception as e:
#         session.rollback()
#         raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.get("/search", response_model=List[TasksPublic])
def search_tasks(
    session: SessionDep, 
    current_user: CurrentUser,
    title: Optional[str] = Query(None),
    category_title: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
):
    try:
        query = session.query(Task).join(Categories, Task.categories_id == Categories.id)

        if title:
            query = query.filter(func.lower(Task.title).contains(title.lower()))
        if category_title:
            query = query.filter(func.lower(Categories.title).contains(category_title.lower()))

        if status:
            query = query.filter(Task.status == status)

        if priority:
            query = query.filter(Task.priority == priority)

        if start_date and end_date:
            query = query.filter(Task.due_date.between(start_date, end_date))
        elif start_date:
            query = query.filter(Task.due_date >= start_date)
        elif end_date:
            query = query.filter(Task.due_date <= end_date)

        # if categories_id:
        #     query = query.filter(Task.categories_id == categories_id)

        tasks = query.all()

        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found matching the criteria")
        # if not current_user.is_superuser:
        #     # tasks = [task for task in tasks if task. == current_user.id]
        #     if not tasks:
        #         raise HTTPException(status_code=403, detail="Not enough permissions to access these tasks")
        # if not current_user.is_superuser:
        #         raise HTTPException(status_code=400, detail="Not enough permissions")
            
        for task in tasks:
            if not current_user.is_superuser:
                raise HTTPException(status_code=400, detail="Not enough permissions")
        return tasks

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
