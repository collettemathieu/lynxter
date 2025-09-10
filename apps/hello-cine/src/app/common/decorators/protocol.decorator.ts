import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.protocol || defaultValue;
  }
);
