import { CancelablePromise } from "../core/CancelablePromise";
import {
  TasksCreateTaskData,
  TasksCreateTaskResponse,
  TasksDeleteTaskData,
  TasksDeleteTaskResponse,
  TasksDeleteTasksData,
  TasksReadTaskData,
  TasksReadTaskResponse,
  TasksReadTasksData,
  TasksReadTasksResponse,
  TasksRemoveCategoyFromTaskData,
  TasksUpdateStatusTasksData,
  TasksUpdateTaskData,
  TasksUpdateTaskResponse,
} from "../types_gen/tasks.gen";
import { request as __request } from "../core/request";
import { OpenAPI } from "../core/OpenAPI";
export class TasksService {
  /**
   * Read Tasks
   * Retrieve tasks.
   * @param data The data for the request.
   * @param data.skip
   * @param data.limit
   * @returns TasksPublic Successful Response
   * @throws ApiError
   */
  public static readTasks(
    data: TasksReadTasksData = {}
  ): CancelablePromise<TasksReadTasksResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/tasks/",
      query: {
        skip: data.skip,
        limit: data.limit,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create Task
   * Create new Task.
   * @param data The data for the request.
   * @param data.requestBody
   * @returns TaskPublic Successful Response
   * @throws ApiError
   */
  public static createTask(
    data: TasksCreateTaskData
  ): CancelablePromise<TasksCreateTaskResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/tasks/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Read Task
   * Get Task by ID.
   * @param data The data for the request.
   * @param data.id
   * @returns TaskPublic Successful Response
   * @throws ApiError
   */
  public static readTask(
    data: TasksReadTaskData
  ): CancelablePromise<TasksReadTaskResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/tasks/{id}",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Item
   * Update an Item.
   * @param data The data for the request.
   * @param data.id
   * @param data.requestBody
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updateTask(
    data: TasksUpdateTaskData
  ): CancelablePromise<TasksUpdateTaskResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/tasks/{id}",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static updateStatusTasks(
    data: TasksUpdateStatusTasksData
  ): CancelablePromise<TasksUpdateTaskResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/tasks/status",
      // path: {
      //   id: data.id,
      // },
      // body: data.requestBody, query: {
      query: {
        task_ids: data.ids,
        status: data.status,
      },
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  // /**
  //  * Delete Item
  //  * Delete an item.
  //  * @param data The data for the request.
  //  * @param data.id
  //  * @returns Message Successful Response
  //  * @throws ApiError
  //  */
  public static deleteTask(
    data: TasksDeleteTaskData
  ): CancelablePromise<TasksDeleteTaskResponse> {
    console.log("data.task.id", data.id);
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/tasks/{id}",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static removeCategoryfromTask(
    data: TasksRemoveCategoyFromTaskData
  ): CancelablePromise<TasksDeleteTaskResponse> {
    console.log("data.task.id", data.id);
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/tasks/{id}/categories",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  public static deleteTasks(
    data: TasksDeleteTasksData
  ): CancelablePromise<TasksDeleteTaskResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/tasks",
      // path: {
      //   id: data?.ids
      //   // id: data?.ids.map(id=>id),

      // },
      body: data.ids,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
