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
        
        # Update task's notes_id
        # if task_id:
        #     if task.notes_id is None:
        #         task.notes_id = []
        #     print(str(note.id))
        #     task.notes_id.append(str(note.id))
        #     session.add(task)
        #     session.commit()
        
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

@router.get("/task/{task_id}/notes", response_model=NotesPublic)
def get_notes_by_task_id(task_id: uuid.UUID, current_user: CurrentUser, session: SessionDep):
    """
    Get all notes for a specific task
    """
    try:
        # Check if the task exists
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Get all notes for the task
        statement = select(Notes).where(Notes.task_id == task_id)
        notes = session.exec(statement).all()

        return NotesPublic(data=notes, count=len(notes))
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
    
@router.put('/{note_id}', response_model=NotePublic)
def update_note(*, session: SessionDep, current_user: CurrentUser, note_id: uuid.UUID, task_update: NoteUpdate, task_id: Optional[uuid.UUID] = None,):
    try: 
        note = session.get(Notes, note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        if not current_user.is_superuser and note.owner_id != current_user.id:
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
        if not current_user.is_superuser and note.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions")
        session.delete(note)
        session.commit()
        return {"message": "Note deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    

@router.delete("/notes", response_model=dict)
def delete_notes(note_ids: List[uuid.UUID], current_user: CurrentUser, session: SessionDep):
    try:
        for note_id in note_ids:
            note = session.get(Notes, note_id)
            if not current_user.is_superuser and note.owner_id != current_user.id:
                raise HTTPException(status_code=400, detail="Not enough permissions")
            if not note:
                raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")
            if note.owner_id != current_user.id:
                raise HTTPException(status_code=400, detail="Not enough permissions")
            session.delete(note)
            
            # Update task's notes_id
            # if note.task_id:
            #     task = session.get(Task, note.task_id)
            #     if task and task.notes_id:
            #         task.notes_id = [nid for nid in task.notes_id if nid != note_id]
            #         session.add(task)
        
        session.commit()
        return {"message": "Notes deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")