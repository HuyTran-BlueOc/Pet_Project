import { Message } from "./types.gen";

export type TaskInit = {
  title: string;
  description?: string | null;
  status: ETaskStatus;
  priority: ETaskPriority;
  due_date?: string;
  categories_id?: string | null;
};

export type TaskPublic = {
  title: string;
  description?: string | null;
  id: string;
  owner_id: string;
  status: ETaskStatus;
  priority: ETaskPriority;
  due_date?: string;
  categories_id?: string;
  created_at: string;
  updated_at: string;
  category_title?: string | null;
};

export type TasksPublic = {
  data: Array<TaskPublic>;
  count: number;
};

export type TasksReadTasksData = {
  limit?: number;
  skip?: number;
  search?: string
};

export type TasksReadTasksResponse = TasksPublic;

export type TasksCreateTaskData = {
  // requestBody: TaskCreate;
  requestBody: TaskInit;
};

export type TasksCreateTaskResponse = TaskPublic;

export type TasksReadTaskData = {
  id: string;
};

export type TasksReadTaskResponse = TaskPublic;

export type TasksUpdateTaskData = {
  id: string;
  // requestBody: TaskUpdate;
  requestBody: TaskInit;
};

export type TasksUpdateStatusTasksData = {
  ids: string[];
  status: ETaskStatus;
};

// export type TasksUpdateStatusTasksResponse = {
//   id: string[];
//   status: ETaskStatus;
// };

export type TasksUpdateTaskResponse = TaskPublic;

export type TasksDeleteTaskData = {
  id: string;
};

export type TasksRemoveCategoyFromTaskData = {
  id: string;
};

export type TasksDeleteTasksData = {
  ids: string[];
};

export type TasksDeleteTaskResponse = Message;

//=====================
// Enum Task
//=====================

export enum ETaskStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum ETaskPriority {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}


//Notes
export interface INoteInit {
  title: string;
  description: string;
}

export interface INoteCreate {
  task_id: string;
  requestBody: INoteInit;
}

export interface INoteUpdate {
  note_id: string;
  requestBody: INoteInit;
}

export interface INotesDelete {
  ids: Array<string>;
}

export interface INote {
  id: string;
  task_id: string;
  title: string;
  description: string;
}

export interface IListNote {
  data: Array<INote>;
  count: number;
}


export interface INotesDataByIdTask extends TasksReadTaskData {}
