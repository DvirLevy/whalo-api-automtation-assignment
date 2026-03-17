import { APIRequestContext, expect } from "@playwright/test";
import { ApiRequest } from "../infrastructure/APIHandlers/APIRequest";

const WheelSpin = async (request: APIRequestContext, data: Record<string, any>, accessToken: string) => {
  const apiRequest = new ApiRequest(request)
  apiRequest.setHeader("accessToken", accessToken)
  const response = await apiRequest.post(
    `${process.env.HOST}/api/frontend/wheel/v1`, data)
  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  return body.response
};

export default WheelSpin;