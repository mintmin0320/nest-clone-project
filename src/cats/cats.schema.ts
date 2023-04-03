import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { Comments } from 'src/comments/comments.schema';

const options: SchemaOptions = { // DB에서 하나가 만들어지면 타임스탬프가 찍힌다.
  timestamps: true,
}

@Schema(options) //스키마 정의
export class Cat extends Document {  // 몽구스 도큐먼트를 상속받고
  @ApiProperty({  //swagger에서 데이터 입력 예시 형태를 제공
    example: 'mintmin0320@gmail.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({  //swagger에서 데이터 입력 예시 형태를 제공
    example: 'mintmin',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({  //swagger에서 데이터 입력 예시 형태를 제공
    example: '1234',
    description: 'password(string)',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({//디폴트 이미지 설정하기 회원가입 시 이미지를 업로드 안 하니까
    default:
      'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg'
  })
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string,
    email: string,
    name: string,
    imgUrl: string,
    comments: Comments[];
  };
  readonly comments: Comments[];
}

const _CatSchema = SchemaFactory.createForClass(Cat);

_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

_CatSchema.virtual('comments', {
  ref: 'comments', //comments 스키마와 연결
  localField: '_id',
  foreignField: 'info', //외레필드
});
_CatSchema.set('toObject', { virtuals: true }); //populate 옵션을 사용하기 위한 두 가지 옵션
_CatSchema.set('toJSON', { virtuals: true });

export const CatSchema = _CatSchema;