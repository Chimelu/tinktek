import { Response } from "express";
import { IResponseMessage } from "./reponseMessage";
import { HttpStatusCode } from "../constants";

/**
 * Represents a class for generating response messages with success or error status.
 */
class ResponseMessage {
  /**
   * Generates a standardized success response object for API calls.
   * @param {Response} res - The Express Response object for sending the response.
   * @param data - The payload data to be included in the response.
   * @param message - Optional. A custom success message to be included. If not provided,
   *                   the function checks if a message exists in the 'data' parameter; if found,
   *                   it uses that message. If no message is found, it defaults to "Success."
   * @param statusCode - Optional. A custom HTTP status code to be included in the response.
   *                     If not provided, the function checks if a status code exists in the 'data' parameter;
   *                     if found, it uses that status code. If no status code is found, it defaults to 200 (OK).
   *
   * @returns An object conforming to the IResponseMessage interface, representing a successful API response.
   *          The object includes a boolean 'status' indicating success, a status code, a message,
   *          and the payload data.
   */
  public static success(
    res: Response,
    data: any,
    message?: string,
    statusCode: number = 200
  ): Response {
    const isPagedResponse = data?.data && data?.pagination;

    const resp: IResponseMessage = {
      message: message ? message : data?.message ? data.message : "Success",
      status: true,
      statusCode: statusCode
        ? statusCode
        : data?.statusCode
        ? data?.statusCode
        : HttpStatusCode.OK,
      data: isPagedResponse ? data : data?.data ? data?.data : data,
    };

    return res.status(statusCode || 400).json(resp);
  }

  /**
   * Generates a standardized error response object for API calls.
   * @param {Response} res - The Express Response object for sending the response.
   * @param data - The error payload data to be included in the response.
   * @param message - Optional. A custom error message to be included. If not provided,
   *                   the function checks if a message exists in the 'data' parameter; if found,
   *                   it uses that message. If no message is found, it defaults to "Failed."
   * @param statusCode - Optional. A custom HTTP status code to be included in the response.
   *                     If not provided, the function checks if a status code exists in the 'data' parameter;
   *                     if found, it uses that status code. If no status code is found, it defaults to 200 (OK).
   *
   * @returns An object conforming to the IResponseMessage interface, representing an error in an API response.
   *          The object includes a boolean 'status' indicating failure, a status code, an error message,
   *          and the error payload data.
   *
   * @template E - The type of the error payload data.
   */
  public static error(
    res: Response,
    data: any,
    message?: string,
    statusCode: number = 400
  ): Response {
    const resp: IResponseMessage = {
      message: message
        ? message
        : data?.response?.data
        ? data?.response?.data?.message
        : data?.message
        ? data.message
        : "Failed",
      status: false,
      statusCode: statusCode
        ? statusCode
        : data?.statusCode
        ? data?.statusCode
        : data?.response?.status
        ? data.response.status
        : HttpStatusCode.BAD_REQUEST,
      data: data?.response?.data
        ? data?.response?.data
        : data?.error
        ? data?.error
        : data
        ? data
        : Error,
    };

    return res.status(statusCode || 400).json(resp);
  }
}

export default ResponseMessage;
