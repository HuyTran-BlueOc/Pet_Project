import { ETaskPriority, ETaskStatus } from "../types_gen/tasks.gen";

export const TaskCreateSchema = {
  properties: {
    title: {
      type: "string",
      maxLength: 255,
      minLength: 1,
      title: "Title",
    },
    description: {
      anyOf: [
        { type: "string", maxLength: 255 },
        { type: "null" },
      ],
      title: "Description",
    },
    status: {
      type: "string",
      enum: Object.values(ETaskStatus),
      default: ETaskStatus.PENDING,
      title: "Status",
    },
    priority: {
      type: "string",
      enum: Object.values(ETaskPriority),
      default: ETaskPriority.MEDIUM,
      title: "Priority",
    },
    due_date: {
      anyOf: [
        { type: "string", format: "date-time" },
        { type: "null" },
      ],
      title: "Due Date",
    },
    categories_id: {
      anyOf: [
        { type: "string", format: "uuid" },
        { type: "null" },
      ],
      title: "Categories ID",
    },
  },
  type: "object",
  required: ["title"],
  title: "TaskCreate",
} as const;

export const TaskPublicSchema = {
  properties: {
    title: {
      type: "string",
      maxLength: 255,
      minLength: 1,
      title: "Title",
    },
    description: {
      anyOf: [
        { type: "string", maxLength: 255 },
        { type: "null" },
      ],
      title: "Description",
    },
    id: {
      type: "string",
      format: "uuid",
      title: "Id",
    },
    categories_id: {
      anyOf: [
        { type: "string", format: "uuid" },
        { type: "null" },
      ],
      title: "Categories ID",
    },
    status: {
      type: "string",
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      title: "Status",
    },
    priority: {
      type: "string",
      enum: ["LOW", "MEDIUM", "HIGH"],
      title: "Priority",
    },
    due_date: {
      anyOf: [
        { type: "string", format: "date-time" },
        { type: "null" },
      ],
      title: "Due Date",
    },
    created_at: {
      type: "string",
      format: "date-time",
      title: "Created At",
    },
    updated_at: {
      type: "string",
      format: "date-time",
      title: "Updated At",
    },
  },
  type: "object",
  required: ["title", "id", "status", "priority", "created_at", "updated_at"],
  title: "TaskPublic",
} as const;

export const TaskUpdateSchema = {
  properties: {
    title: {
      anyOf: [
        { type: "string", maxLength: 255, minLength: 1 },
        { type: "null" },
      ],
      title: "Title",
    },
    description: {
      anyOf: [
        { type: "string", maxLength: 255 },
        { type: "null" },
      ],
      title: "Description",
    },
    status: {
      anyOf: [
        { type: "string", enum: Object.values(ETaskStatus), },
        { type: "null" },
      ],
      title: "Status",
    },
    priority: {
      anyOf: [
        { type: "string",enum: Object.values(ETaskPriority), },
        { type: "null" },
      ],
      title: "Priority",
    },
    due_date: {
      anyOf: [
        { type: "string", format: "date-time" },
        { type: "null" },
      ],
      title: "Due Date",
    },
  },
  type: "object",
  title: "TaskUpdate",
} as const;

export const TasksPublicSchema = {
  properties: {
    data: {
      items: {
        $ref: "#/components/schemas/TaskPublic",
      },
      type: "array",
      title: "Data",
    },
    count: {
      type: "integer",
      title: "Count",
    },
  },
  type: "object",
  required: ["data", "count"],
  title: "TasksPublic",
} as const;
