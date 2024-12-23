from datetime import datetime
import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Message, Task, TaskCreate, TaskPublic, TaskUpdate, TasksPublic

router = APIRouter(prefix="/tasks", tags=["tasks"])

# @router.get("/", response_model = TasksPublic)
# def get_tasks_by_owner(
#   session: SessionDep, owner_id: uuid.UUID, skip: int = 0, limit: int = 99999
# ) -> Any:
#   statement = select(Task).where(Task.owner_id == owner_id).offset(skip).limit(limit)
#   results = session.exec(statement).all()
#   count = session.exec(select(Task).where(Task.owner_id == owner_id)).count()
#   return TasksPublic(data=results, count=count) 

@router.get("/", response_model=TasksPublic)
def get_tasks_by_owner(
    session: SessionDep, 
    current_user: CurrentUser, 
    skip: int = 0, 
    limit: int = 99999
) -> Any:
    try:
        # Truy vấn danh sách Task thuộc về người dùng hiện tại
        statement = (
            select(Task)
            .where(Task.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        results = session.exec(statement).all()

        # Đếm tổng số Task thuộc về người dùng hiện tại
        count_statement = select(func.count()).where(Task.owner_id == current_user.id).select_from(Task)
        count = session.exec(count_statement).one() # Lấy giá trị đầu tiên từ kết quả tuple

        # Trả về kết quả
        return TasksPublic(data=results, count=count)
    except Exception as e:
        session.rollback()  # Rollback nếu có lỗi xảy ra
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.get("/{task_id}", response_model=TaskPublic)
def get_task(session: SessionDep, task_id: uuid.UUID ):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# @router.post("/",response_model=TaskPublic)
# def create_task(*, session: SessionDep, current_user: CurrentUser,task_create: TaskCreate) -> Any:
#   task = Task(**task.model_dump(), owner_id=current_user.id)
#   session.add(task)
#   session.commit()
#   session.refresh(task)
#   return task

@router.post("/",response_model=TaskPublic)
def create_task(session: SessionDep, current_user: CurrentUser, task: TaskCreate):
    try: 
        task = Task(**task.model_dump(), owner_id=current_user.id)
        session.add(task)
        session.commit()
        session.refresh(task)
        return task
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.put('/{task_id}', response_model=TaskPublic)
def update_task(*, session: SessionDep,task_id: uuid.UUID,task_update: TaskUpdate ):
  task = session.get(Task, task_id)
  if not task:
    raise HTTPException(status_code=404, detail="Task not found")
  for key, value in task_update.dict(exclude_unset=True).items():
      setattr(task, key, value)
  task.updated_at = datetime.utcnow()
  session.add(task)
  session.commit()
  session.refresh(task)
  return task

@router.delete("/tasks/{task_id}", response_model=dict)
def delete_task(task_id: uuid.UUID, session: SessionDep):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"detail": "Task deleted successfully"}

@router.patch("/status", response_model=dict)
def update_tasks_status(
    session: SessionDep,
    task_ids: List[uuid.UUID] = Query(...),
    status: str = Query(...),
)-> Message:
    tasks = session.exec(select(Task).where(Task.id.in_(task_ids))).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    for task in tasks:
        task.status = status
        task.updated_at = datetime.utcnow()
        session.add(task)
    session.commit()
    return Message(message = "Status of {len(tasks)} tasks updated successfully")


@router.delete("/tasks", response_model=dict)
def delete_tasks(session: SessionDep, task_ids: List[uuid.UUID] = Query(...))-> Message:
    tasks = session.exec(select(Task).where(Task.id.in_(task_ids))).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    for task in tasks:
        session.delete(task)
        session.commit()
    return Message(message = "{len(tasks)} tasks deleted successfully")