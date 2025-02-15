import { Request, Response } from "express";

export type AppRequest<
  T extends {
    params?: any;
    query?: any;
    body?: any;
  } = {},
> = Request<T["params"], any, T["body"], T["query"]>;

export type AppResponse<T = any> = Response<{
  error: boolean;
  data: T | null;
  message: string | null;
}>;
