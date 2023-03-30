import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = { // DB에서 하나가 만들어지면 타임스탬프가 찍힌다.
  timestamps: true,
}

@Schema(options) //스키마 정의
export class Cat extends Document {  // 몽구스 도큐먼트를 상속받고
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  imgUrl: string;

  readonly readOnlyData: { id: string, email: string, name: string };
}

export const CatSchema = SchemaFactory.createForClass(Cat) // Cat 클래스를 스키마로 만들어준다

CatSchema.virtual('readOnlyData').get(function (this: Cat) { // 비밀번호는 노출되면 안됨.. 필요한 것만 리턴하자
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  }
}) 