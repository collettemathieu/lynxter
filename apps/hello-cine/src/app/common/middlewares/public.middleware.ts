import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

export const requestMethods = {
  GET: 'GET' as const,
  POST: 'POST' as const,
};

export type RequestMethods = keyof typeof requestMethods;

export const requestMethodToInt: Record<RequestMethods, number> = {
  GET: 0,
  POST: 1,
};

@Injectable()
export class PublicMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    if (
      requestMethodToInt[req.method as RequestMethods] === RequestMethod.GET
    ) {
      req.headers['authorization'] = this.configService.get('API_KEY');
    }
    next();
  }
}
