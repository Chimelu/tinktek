/**
 * @class ApplicationError
 * @description base error class for application
 * @extends Error
 */
export class ApplicationError extends Error {
    statusCode: any;
    errors: any;
    /**
     * @description initializes the error class
     *
     * @param {number} statusCode status code of the request
     * @param {string} message error message
     * @param {string} errors an array containing errors
     */
    constructor(statusCode: any, message = "an error occurred", errors?: any) {
      super(message);
      this.statusCode = statusCode || 500;
      this.message = message;
      this.errors = errors;
    }
  }
  
  /**
   * @class BadRequestError
   * @description error class for bad request
   * @extends ApplicationError
   */
  export class BadRequestError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(400, message || "Bad request.");
    }
  }
  
  /**
   * @class NotFoundError
   * @description error class for not found
   * @extends ApplicationError
   */
  export class NotFoundError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(404, message || "Route not found.");
    }
  }
  
  /**
   * @class ConflictError
   * @description error class for conflicts.
   * @extends ApplicationError
   */
  export class ConflictError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(409, message);
    }
  }
  
  /**
   * @class UnauthorizedError
   * @description error class for unauthenticated users.
   * @extends ApplicationError
   */
  export class UnauthorizedError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(401, message || "You are unauthorized.");
    }
  }
  
  /**
   * @class UnauthorizedError
   * @description error class for unauthenticated users.
   * @extends ApplicationError
   */
  export class ForbiddenError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message?: string) {
      super(403, message || "Access Forbidden");
    }
  }
  
  export class ProxyAuthenticationRequiredError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(407, message || "Proxy Authentication Required");
    }
  }
  export class RequestTimeoutError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(408, message || "Request Timeout");
    }
  }
  
  export class TooManyRequests extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(429, message || "Too Many Requests");
    }
  }
  
  
  export class UnsupportedMediaType extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(415, message || "Unsupported Media Type");
    }
  }

  export class ServerError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message: string) {
      super(500, message || "Server Error");
    }
  }
  
  