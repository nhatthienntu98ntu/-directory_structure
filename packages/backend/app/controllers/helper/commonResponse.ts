import { Response } from 'express';

export class CommonResponse {
  private customResponse = (res: Response, status: number, message: string) => {
    // res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    // console.log('status: ', status, 'message; ', message);
    return res.status(status).json(message);
  }

  successResponse = (res: Response, message: any) => {
    return this.customResponse(res, 200, message);
  }

  createdResponse = (res: Response, message: any) => {
    return this.customResponse(res, 201, message);
  }

  forbiddenResponse = (res: Response, message: any) => {
    return this.customResponse(res, 403, message);
  }

  badRequest = (res: Response, message: any) => {
    return this.customResponse(res, 400, message);
  }

  unprocessedRequest = (res: Response, message: any) => {
    return this.customResponse(res, 422, message);
  }

  unAuthorizedRequest = (res: Response, message: any) => {
    return this.customResponse(res, 401, message);
  }

  serverErrorResponse = (res: Response, message: any) => {
    return this.customResponse(res, 500, message);
  }

  notFoundError = (res: Response, message: any) => {
    return this.customResponse(res, 404, message);
  }

  handleError = (res: Response, err: any, methodName: string) => {
    if (err.kind === 'ObjectId') {
      return this.notFoundError(res, { message: methodName + ' not found' });
    }

    return this.serverErrorResponse(res, { message: 'Error in ' + methodName, detail: err });
  }
}
