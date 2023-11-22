import { AuthController } from './authorisation/auth.controller';
import { AuthService } from './authorisation/auth.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
//import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverModule } from './driver/driver.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // UserModule,
    // TypeOrmModule.forRoot({
    // type: 'postgres',
    // host: 'localhost',
    // port: 5432,
    // username: 'yourways',
    // password: '123456',
    // database: 'yourways_db',
    // autoLoadEntities: true,
    // synchronize: true,
    // }),
    DriverModule,
    // Import the ConfigModule
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET_KEY,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AppController],
  providers: [AuthService, AppService],
})
export class AppModule {}
