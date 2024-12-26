import { Message } from "./types.gen";

// ========================
// don't use
// ========================

// export type TaskCreate = {
//   title: string;
//   description?: string | null;
//   status:ETaskStatus;
//   priority:ETaskPriority;
//   due_date?: string;
//   categories_id?:string | null;
// };

export type TaskInit = {
  title: string;
  description?: string | null;
  status:ETaskStatus;
  priority:ETaskPriority;
  due_date?: string;
  categories_id?:string | null;
};

export type TaskPublic = {
  title: string;
  description?: string | null;
  id: string;
  owner_id: string;
  status:ETaskStatus;
  priority:ETaskPriority;
  due_date?: string;
  categories_id?:string;
  created_at:string;
  updated_at:string;
};

export type TasksPublic = {
  data: Array<TaskPublic>;
  count: number;
};

// ========================
// don't use
// ========================

// export type TaskUpdate = TaskCreate

export type TasksReadTasksData = {
  limit?: number;
  skip?: number;
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

export type TasksUpdateTaskResponse = TaskPublic;

export type TasksDeleteTaskData = {
  id: string;
};

export type TasksDeleteTaskResponse = Message;

// export type TasksDeleteTasksResponse = Message;

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
