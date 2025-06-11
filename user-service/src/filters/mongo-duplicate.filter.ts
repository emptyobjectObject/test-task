import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoServerError)
export class MongoDuplicateKeyFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      const field = Object.keys(exception.keyValue)[0];

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Duplicate value for field '${field}'`,
        error: 'DuplicateKeyError',
      });
    }

    // Fallback: Let Nest handle other MongoDB errors
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
