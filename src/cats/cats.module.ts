import { Cat, CatSchema } from './cats.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],// 해당 스키마를 등록해서 사용가능하게함
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule { }
