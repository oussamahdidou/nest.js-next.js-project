import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPackage = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.package[data];
    }
    return request.package;
  },
);