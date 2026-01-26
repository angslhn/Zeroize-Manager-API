class ResponseError extends Error {
  public statusCode: number;
  public title: string;

  constructor(statusCode: number, title: string, message: string, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.title = title;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

export default ResponseError;
