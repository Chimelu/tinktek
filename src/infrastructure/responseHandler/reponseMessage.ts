import { Response } from "express";

export interface IResponseMessage {
  data: any;
  status: boolean;
  message: string;
  statusCode: number;
  responseCode?: number; // this is used to define specific error type
}
