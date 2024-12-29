from sqlmodel import func, select
from app.api.deps import CurrentUser, SessionDep
from app.models import Task
from datetime import datetime
def cronjob( session: SessionDep, current_user: CurrentUser  
) -> bool:

    if current_user.is_superuser:
        
    else:
        statement = (
            select(Task)
            .where(
            and_(
            Task.owner_id == current_user.id,
            Task.due_date == datetime.now()
        ))
        )
        task = session.exec(statement).scalar()
        if(task>0)
            return True
