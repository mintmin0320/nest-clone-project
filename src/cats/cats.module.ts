import { AuthModule } from './../auth/auth.module';
import { Cat, CatSchema } from './cats.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { CatsController } from './controller/cats.controller';
import { CatsService } from './services/cats.service';
import { CatsRepository } from './cats.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload', //데스티니네이션에 약자 기본적으로 업로드라는 폴더에 저장된다.
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    forwardRef(() => AuthModule), // 순환 참조 발생으로 forwardRef사용
  ],// 해당 스키마를 등록해서 사용가능하게함
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository], // 캡슐화되어있는 providers를 사용하려면 exports 해주면 됨
})
export class CatsModule { }
