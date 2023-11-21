// permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const [request] = context.getArgs();
    const userPermissions = request?.user?.permissions || [];
    const requiredPermissions =
      this.reflector.get('permissions', context.getHandler()) || [];

    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    try {
      const decoded = this.jwtService.verify(token);
      const jwtPermissions = decoded.permissions || [];

      const hasAllRequiredPermissions = requiredPermissions.every(
        (permission) => jwtPermissions.includes(permission),
      );

      if (requiredPermissions.length === 0 || hasAllRequiredPermissions) {
        return true;
      } else {
        throw new ForbiddenException(
          'Authorization failed: Insufficient permissions',
        );
      }
    } catch (error) {
      throw new ForbiddenException('Authorization failed: Invalid token');
    }
  }
}
