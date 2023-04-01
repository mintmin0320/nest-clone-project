import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';

//여러개의 모듈들이 앱모듈에서 임포트 돼어서 메인.js에서 실행함
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.Mode === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats'); //cats 라우터에 바인딩 *면 전체
    mongoose.set('debug', this.isDev); //개발할때 몽구스 쿼리가 찍힘 프로젝트 배포시에는 false로
  }
} 