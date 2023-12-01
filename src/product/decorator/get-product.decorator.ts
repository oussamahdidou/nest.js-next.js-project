import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetProduct = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.product[data];
    }
    return request.product;
  },
);