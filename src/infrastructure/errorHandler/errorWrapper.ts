import { config as dotEnvConfig } from 'dotenv';
import debug from 'debug';
import config from '../config/env.config';
import logger from '../logger/logger';
import ResponseMessage from '../responseHandler/response.handler';

dotEnvConfig();

const DEBUG = debug('dev');
const { env } = config;

export const errorHandler = (error: any, _: any, response: any, next: any) => {
  const isProduction = env === 'production';
  let errorMessage = {};

  if (response.headersSent) {
    return next(error);
  }

  if (!isProduction) {
    DEBUG(error.stack);
    errorMessage = error;

    if (error.statusCode === 500) {
      logger.error(error);
    }
  } else {
    if (error.statusCode === 500) {
      logger.error(error);
    }
  }

  return ResponseMessage.error(
    response,
    error,
    error.message,
    error.statusCode || 500,
  );
};

export const printError = (e: any) => {
  const regex: any = /\((.*):(\d+):(\d+)\)$/;
  const caller: any = regex.exec(e?.stack.split('\n')[2]);
  const issue: any = regex.exec(e?.stack.split('\n')[1]);

  const formattedErr = {
    functionName: issue?.input ? extractFunctionName(issue?.input) + '()' : '',
    callerName: caller?.input ? extractFunctionName(caller?.input) + '()' : '',
    calledIn: caller ? caller[1] : '',
    calledAt: caller ? `${caller[2]}:${caller[3]}` : '',
    implementIn: issue ? issue[1] : '',
    errorAt: issue ? `${issue[2]}:${issue[3]}` : '',
    message: e?.message,
  };

  console.log('Error trace ', formattedErr);
  return formattedErr;
};

const extractFunctionName = (stackLine: any) => {
  const regex = /at (.*?) \(/;
  const match = stackLine.match(regex);
  let fn;
  if (match && match[1] === 'Object.<anonymous>') {
    fn = 'called in file and not in method';
  } else {
    fn = match ? match[1] : 'unknown';
  }
  return fn;
};
