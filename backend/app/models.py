import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, ARRAY
from sqlalchemy import Column 
from sqlalchemy.dialects.postgresql import JSONB

from enum import Enum
from typing import Optional, List
from datetime import datetime


# =========================
# ENUMS
# =========================
class ETaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class ETaskPriority(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

# =========================
# USER MODELS
# =========================

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    categories: list["Categories"] = Relationship(back_populates="owner", cascade_delete=True)
    notes: list["Notes"] = Relationship(back_populates="owner", cascade_delete=True)
    tasks: list["Task"] = Relationship(back_populates="owner", cascade_delete=True)

# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

# =========================
# CATEGORY MODELS
# =========================

# Shared properties
class CategoriesBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class CategoriesCreate(CategoriesBase):
    pass


# Properties to receive on item update
class CategoriesUpdate(CategoriesBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore
    description: str | None = Field(default=None, max_length=255, nullable=True)  # Description is optional

# Database model, database table inferred from class name

class Categories(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # UUID primary key
    title: str = Field(max_length=255, nullable=False)  # Title is required
    description: str | None = Field(default=None, max_length=255, nullable=True)  # Description is optional
    tasks: list["Task"] = Relationship(back_populates="category", cascade_delete=True)
    owner: Optional[User] = Relationship(back_populates="categories")
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=True, ondelete="CASCADE")
# Properties to return via API, id is always required
class CategoryPublic(CategoriesBase):
    id: uuid.UUID
    title: str
    description: str | None


class CategoriesPublic(SQLModel):
    data: list[CategoryPublic]
    count: int
    



# =========================
# TASK MODELS
# =========================

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    status: ETaskStatus = Field(default=ETaskStatus.PENDING)
    priority: ETaskPriority = Field(default=ETaskPriority.MEDIUM)
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    categories_id: Optional[uuid.UUID] = None
    notes_id: Optional[uuid.UUID] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[ETaskStatus] = None
    priority: Optional[ETaskPriority] = None
    due_date: Optional[datetime] = None
    categories_id: Optional[uuid.UUID] = None
    notes_id: Optional[uuid.UUID] = None

# Task database model
class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    categories_id: Optional[uuid.UUID] = Field(foreign_key="categories.id", nullable=True)
    owner: Optional[User] = Relationship(back_populates="tasks")
    category: Optional[Categories] = Relationship(back_populates="tasks")
    note: list["Notes"] = Relationship(back_populates="task", cascade_delete=True)
    
class TaskPublic(TaskBase):
    id: uuid.UUID
    category_title: str = None
    owner_id: Optional[uuid.UUID]
    categories_id: Optional[uuid.UUID]
    notes_id: Optional[List[uuid.UUID]]

class TasksPublic(SQLModel):
    data: list[TaskPublic]
    count: int
    
class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# =========================
# NOTES MODELS
# =========================

# Shared properties
class NoteBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)

# Properties to receive on item creation
class NoteCreate(NoteBase):
    pass

class NoteUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    
# Database model, database table inferred from class name
class Notes(NoteBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # UUID primary key
    task:  Optional[Task]= Relationship(back_populates="note")
    task_id: uuid.UUID = Field(foreign_key="task.id", nullable=False, ondelete="CASCADE")
    owner: Optional[User] = Relationship(back_populates="notes")
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")

# Properties to return via API, id is always required
class NotePublic(NoteBase):
    id: uuid.UUID
    title: str
    description: str | None
    task_id: uuid.UUID
    owner_id: uuid.UUID


class NotesPublic(SQLModel):
    data: list[NotePublic]
    count: int


# =========================
# AUTH AND GENERIC MODELS
# =========================

# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

