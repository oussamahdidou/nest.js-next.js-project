/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    let user = { userId: 1, username: 'user', permissions: ['read', 'write'] };
    if (!user) {
      // Handle invalid credentials
      return { message: 'Invalid credentials' };
    }
    const token = this.authService.generateJwtToken(user);
    return { access_token: token };
  }
}
