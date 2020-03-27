import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
