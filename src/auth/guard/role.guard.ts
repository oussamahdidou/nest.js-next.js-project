// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (
      !requiredRoles ||
      !Array.isArray(requiredRoles) ||
      requiredRoles.length === 0
    ) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRequiredRole = requiredRoles.includes(user.role);

    return hasRequiredRole;
  }
}
