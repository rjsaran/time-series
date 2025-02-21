import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../..';

export const User = createParamDecorator(
  (key: keyof RequestWithUser['user'], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    const { user } = request;

    return key ? user[key] : user;
  },
);
