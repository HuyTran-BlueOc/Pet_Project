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
def get_task(session: SessionDep, task_id: uuid.UUID ):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
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

# @router.post("/", response_model=TaskPublic)
# def create_task(
#     session: SessionDep, 
#     current_user: CurrentUser, 
#     task: TaskCreate, 
# ): 
#     try: 
#         if task.categories_id:
#             category = session.get(Categories, task.categories_id)
#             if not category:
#                 raise HTTPException(status_code=404, detail="Category not found")

#         new_task = Task(
#             task,
#             owner_id=current_user.id,
#         )
        
#         print("NewTask", new_task)

#         session.add(new_task)
#         session.commit()
#         session.refresh(new_task)
#         return new_task
#     except Exception as e:
#         session.rollback()
#         raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.put('/{task_id}', response_model=TaskPublic)
def update_task(*, session: SessionDep,task_id: uuid.UUID,task_update: TaskUpdate, categories_id: Optional[uuid.UUID] = None,):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(task, key, value)

    if categories_id:
        category = session.get(Categories, categories_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        task.categories_id = categories_id

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.patch("/status", response_model=dict)
def update_tasks_status(
    session: SessionDep,
    task_ids: List[uuid.UUID] = Query(...),
    status: str = Query(...),
):
    tasks = session.exec(select(Task).where(Task.id.in_(task_ids))).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    for task in tasks:
        task.status = status
        task.updated_at = datetime.utcnow()
        session.add(task)
    session.commit()
    return {"detail": f"{len(tasks)} tasks updated successfully"}
@router.delete("/", response_model=dict)
def delete_tasks(task_ids: List[uuid.UUID], session: SessionDep):
    tasks = session.exec(select(Task).where(Task.id.in_(task_ids))).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    for task in tasks:
        session.delete(task)
    session.commit()
    return {"detail": f"{len(tasks)} tasks deleted successfully"}

@router.delete("/{task_id}", response_model=dict)
def delete_task(task_id: uuid.UUID, session: SessionDep):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"detail": "Task deleted successfully"}

@router.delete("/{task_id}/categories", response_model=dict)
def remove_category_from_task(task_id: uuid.UUID, session: SessionDep):
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

    task.categories_id = None
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return {"detail": "Category removed from task successfully"}


# ===================
# fix search
# ===================

@router.get("/search", response_model=List[TasksPublic])
def search_tasks(
    session: SessionDep, 
    title: Optional[str] = Query(None),
    category_title: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    categories_id: Optional[uuid.UUID] = None
):
    try :
        """
        Tìm kiếm và lọc tasks theo tiêu đề, trạng thái, độ ưu tiên, ngày hạn chót.
        """
        query = session.query(Task).join(Categories, Task.categories_id == categories_id)

        # Tìm kiếm theo tiêu đề task hoặc category
        if title:
            query = query.filter(func.lower(Task.title).contains(title.lower()))
        if category_title:
            query = query.filter(func.lower(Categories.title).contains(category_title.lower()))

        # Lọc theo trạng thái
        if status:
            query = query.filter(Task.status == status)

        # Lọc theo độ ưu tiên
        if priority:
            query = query.filter(Task.priority == priority)

        # Lọc theo ngày hạn chót
        if start_date and end_date:
            query = query.filter(Task.due_date.between(start_date, end_date))
        elif start_date:
            query = query.filter(Task.due_date >= start_date)
        elif end_date:
            query = query.filter(Task.due_date <= end_date)

        # Thực thi truy vấn
        tasks = query.all()
        if not tasks:
            raise HTTPException(status_code=404, detail="No tasks found matching the criteria")

        return tasks
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")