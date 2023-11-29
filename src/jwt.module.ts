// jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // Set your desired expiration time
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtAuthModule {}
export { JwtModule };
