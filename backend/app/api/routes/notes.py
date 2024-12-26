from datetime import date, datetime
import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import NoteCreate, Notes, Task, NotePublic, NotesPublic, NoteUpdate

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/")
async def create_notes(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    notes_input: NoteCreate,
    task_id: Optional[uuid.UUID] = None
) -> Any:
    """
    Create a new note
    """
    try:
        # Check if the task_id exists
        if task_id:
            task = session.get(Task, task_id)
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
        
        # Create a new note
        note = Notes(
            title=notes_input.title,
            description=notes_input.description,
            task_id=task_id,
            owner_id=current_user.id
        )
        session.add(note)
        session.commit()
        session.refresh(note)
        return note
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.get('/', response_model=NotesPublic)
def read_note(
    session: SessionDep, 
    current_user: CurrentUser,
    skip: int = 0, 
    limit: int = 9999
) -> Any: 
    """
    Retrieve Note 
    """
    try:
        statement = (
            select(Notes)
            .where(Notes.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        results = session.exec(statement).all()

        count_statement = select(func.count()).where(Notes.owner_id == current_user.id).select_from(Notes)
        count = session.exec(count_statement).one() 

        return NotesPublic(data=results, count=count)
    except Exception as e:
        session.rollback()  
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
    
@router.put('/{note_id}', response_model=NotePublic)
def update_note(*, session: SessionDep, current_user: CurrentUser, note_id: uuid.UUID, task_update: NoteUpdate, task_id: Optional[uuid.UUID] = None,):
    try: 
        note = session.get(Notes, note_id)
        print(note)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        if note.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
        if task_id:
            task = session.get(Task, task_id)
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
        note.title = task_update.title
        note.description = task_update.description
        note.task_id = task_id
        session.add(note)
        session.commit()
        session.refresh(note)
        return note
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
    
@router.delete("/notes/{note_id}", response_model=dict)
def delete_note(note_id: uuid.UUID, current_user: CurrentUser, session: SessionDep):
    try: 
        note = session.get(Notes, note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        if note.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
        session.delete(note)
        session.commit()
        return {"message": "Note deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")