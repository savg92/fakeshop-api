/**
 * Global exception filter that catches and formats all HTTP exceptions.
 * Provides a standardized error response format and logs error details.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Catches and formats HTTP exceptions into a standardized response
   * @param exception The caught HTTP exception
   * @param host The arguments host containing the request and response
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Create standardized error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      error: exception.name,
    };

    // Log error details for debugging
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${exception.message}`,
    );

    // Send formatted error response
    response.status(status).json(errorResponse);
  }
}
