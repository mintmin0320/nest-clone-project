import { CatsModule } from './../cats/cats.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // Strategy기본적인설정

    JwtModule.register({      //로그인시사용 , jwt를 만들어주고 사인해줌
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => CatsModule), // cats 모듈의 exports 된 부분을 사용가능, 서로 참조해서 순환 참조 발생.. forwardRef사용하면 됨
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // 프로바이더 사용을 위해.. 
})
export class AuthModule { }
