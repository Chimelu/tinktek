import logger from '../logger/logger';
import { HttpStatusCode } from './http_status';

export interface ResponseJSON {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: any;
  error?: any;
}

const MakeResponse = {
  /**
   * @author DanielAdek
   * @param {*} data element
   * @param {*} statusCode http code
   * @param {*} message
   * @returns {ResponseJSON} response json
   */
  success: (
    data: any,
    message: string = '',
    statusCode: number = 200,
  ): ResponseJSON => {
    return { status: true, statusCode, message, data };
  },

  /**
   * @author DanielAdek
   * @param {*} data element
   * @param {*} statusCode http code
   * @param {*} message
   * @returns {ResponseJSON} response json
   */
  failure: (
    message: string = '',
    data: any = null,
    statusCode: number = 400,
  ): ResponseJSON => {
    return { status: false, statusCode, message, data };
  },

  /**
   * @author DanielAdek
   * @param {*} error element
   * @param {*} message
   * @param {*} statusCode http code
   * @returns {ResponseJSON} response json
   */
  error: (
    error: any,
    message: string = 'Internal Server Error',
    statusCode: number = HttpStatusCode.INTERNAL_ERROR,
  ): ResponseJSON => {
    logger.log('info', error);
    return { status: false, statusCode, message };
  },
};

export { MakeResponse };
