from sqlmodel import select, and_
from app.api.deps import CurrentUser, SessionDep
from app.models import Task
from datetime import datetime

def get_overdue_tasks(session: SessionDep, current_user: CurrentUser):
    statement = (
        select(Task)
        .where(
            and_(
                Task.owner_id == current_user.id,
                Task.due_date <= datetime.now(),
                Task.status != "Completed"
            )
        )
    )
    return session.exec(statement).all()
