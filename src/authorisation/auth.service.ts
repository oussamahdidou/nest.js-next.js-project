// auth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configservice: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Replace this with your actual user authentication logic
    if (username === 'user' && password === 'password') {
      return { userId: 1, username: 'user', permissions: ['read', 'write'] };
    }
    return null;
  }

  generateJwtToken(user: any): string {
    const payload = {
      sub: user.userId,
      username: user.username,
      permissions: user.permissions,
    };
    const secretKey = process.env.SECRET_OR_KEY;

    console.log(secretKey);
    return this.jwtService.sign(payload, { secret: secretKey });
  }
}
