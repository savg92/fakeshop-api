/**
 * Global interceptor that transforms all successful responses into a standardized format.
 * Wraps the response data with metadata including success status and timestamp.
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface defining the structure of standardized API responses
 */
export interface Response<T> {
  data: T; // The actual response data
  success: boolean; // Indicates successful operation
  timestamp: string; // ISO timestamp of when the response was generated
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * Intercepts the response and transforms it into the standardized format
   * @param context The execution context
   * @param next The next handler in the chain
   * @returns Observable<Response<T>> The transformed response
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        data,
        success: true,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
