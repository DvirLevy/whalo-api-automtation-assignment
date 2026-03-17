import { APIRequestContext, expect } from "@playwright/test";
import { ApiRequest } from "../infrastructure/APIHandlers/APIRequest";

const Login = async (request: APIRequestContext, data: Record<string, any>) => {
  const apiRequest = new ApiRequest(request)
  const response = await apiRequest.post(
    `${process.env.HOST}/api/frontend/login/v4/login`, data)
  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  const respData = body.response.LoginResponse
  return respData
};

export default Login;