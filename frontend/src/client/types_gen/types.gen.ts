// This file is auto-generated by @hey-api/openapi-ts

import { TaskPublic } from "./tasks.gen"

export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type CategoryCreate = {
  title: string
  description?: string | null
}

export type CategoryPublic = {
  id: string
  title: string
  description?: string | null
  tasksData: Array<TaskPublic>;
}

export type CategoriesPublic = {
  data: Array<CategoryPublic>
  count: number
}

export type CategoryUpdate = {
  title?: string | null
  description?: string | null
}

export interface SearchParams {
  title?: string
  description?: string
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type Token = {
  access_token: string
  token_type?: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
}

export type UserCreate = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password: string
}

export type UserPublic = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  id: string
}

export type UserRegister = {
  email: string
  password: string
  full_name?: string | null
}

export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type UserUpdate = {
  email?: string | null
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password?: string | null
}

export type UserUpdateMe = {
  full_name?: string | null
  email?: string | null
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

// Category 
export type CategoriesReadCategoriesData = {
  limit?: number
  skip?: number
  search?: string
}

export type CategoriesReadCategoriesResponse = CategoriesPublic

export type CategoriesCreateCategoriesData = {
  requestBody: CategoryCreate
}

export type CategoriesCreateCategoriesResponse = CategoryPublic

export type CategoriesReadCategoryData = {
  id: string
}

export type CategoriesReadCategoryResponse = CategoryPublic

export type CategoriesUpdateCategoryData = {
  id: string
  requestBody: CategoryUpdate
}

export type CategoriesUpdateCategoryResponse = CategoryPublic

export type CategoriesDeleteCategoryData = {
  id: string
}

export type CategoriesDeleteCategoryResponse = Message

export type CategoriesDeleteCategoriesResponse = Message

export type CategoryReadTaskData = {
  id: string
}

export type CategoryReadTaskResponse = CategoryPublic

export type LoginLoginAccessTokenData = {
  formData: Body_login_login_access_token
}

export type LoginLoginAccessTokenResponse = Token

export type LoginTestTokenResponse = UserPublic

export type LoginRecoverPasswordData = {
  email: string
}


export type LoginRecoverPasswordResponse = Message

export type LoginResetPasswordData = {
  requestBody: NewPassword
}

export type LoginResetPasswordResponse = Message

export type LoginRecoverPasswordHtmlContentData = {
  email: string
}

export type LoginRecoverPasswordHtmlContentResponse = string

export type UsersReadUsersData = {
  limit?: number
  skip?: number
}

export type UsersReadUsersResponse = UsersPublic

export type UsersCreateUserData = {
  requestBody: UserCreate
}

export type UsersCreateUserResponse = UserPublic

export type UsersReadUserMeResponse = UserPublic

export type UsersDeleteUserMeResponse = Message

export type UsersUpdateUserMeData = {
  requestBody: UserUpdateMe
}

export type UsersUpdateUserMeResponse = UserPublic

export type UsersUpdatePasswordMeData = {
  requestBody: UpdatePassword
}

export type UsersUpdatePasswordMeResponse = Message

export type UsersRegisterUserData = {
  requestBody: UserRegister
}

export type UsersRegisterUserResponse = UserPublic

export type UsersReadUserByIdData = {
  userId: string
}

export type UsersReadUserByIdResponse = UserPublic

export type UsersUpdateUserData = {
  requestBody: UserUpdate
  userId: string
}

export type UsersUpdateUserResponse = UserPublic

export type UsersDeleteUserData = {
  userId: string
}

export type UsersDeleteUserResponse = Message

export type UtilsTestEmailData = {
  emailTo: string
}

export type UtilsTestEmailResponse = Message

export type UtilsHealthCheckResponse = boolean


// # =========================
// # TASK 
// # =========================
export * from "./tasks.gen"

// # =========================
// # TASK 
// # =========================
export type NoteCreate = {
  title: string
  description?: string | null
}