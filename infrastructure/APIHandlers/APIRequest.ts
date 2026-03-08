import { APIRequestContext } from "@playwright/test";
import { HEADERS } from "./Headers";

//can also act as an interceptor
export class ApiRequest {

  private _request: APIRequestContext;
  private _headers: Record<string, string>


  constructor(request:APIRequestContext, headers?:Record<string, string>) {
    this._request = request;

    this._headers = {
      ...HEADERS,
      ...headers
    };
  }

  setHeader(key:string,value: string) {
    this._headers[key] = value
  }

  async post(url: string, data: any) {
    return this._request.post(url, {
      headers: this._headers,
      data
    });
  }

  async get(url: string) {
    return this._request.get(url, {
      headers: this._headers
    });
  }
}
