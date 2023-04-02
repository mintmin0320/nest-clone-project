import { HttpExceptionFilter } from './common/execptions/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // 이부분은 아래 useStaticAssets를 사용하기위함 app은 확실하게 익스프레스 앱이 됨
  app.useGlobalPipes(new ValidationPipe()); // 스키마에서 밸리데이션 사용을 위한 등록
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(  //swagger 보안하기
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGEER_PASSWORD,
      },
    }),
  );

  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {//dist의 common이라는 폴더안에 업로드 폴더를 의미 
    prefix: '/media', //http://localhost:8000/media/cats/aaa.png 이런식으로 스태틱파일들 앞에 픽스됨
  })

  const config = new DocumentBuilder()
    .setTitle('C.I.C')
    .setDescription('cat')
    .setVersion('1.0.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: process.env.MODE, // 나중에 배포 단계에서 바꾸자 특정 아이피로
    credentials: true,
  })
  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
