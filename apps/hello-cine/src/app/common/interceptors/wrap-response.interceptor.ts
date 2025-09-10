import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // const request = context.switchToHttp().getRequest();

    // request.body = {};

    return next.handle().pipe(
      map((data) => ({
        data,
      }))
    );
  }
}
