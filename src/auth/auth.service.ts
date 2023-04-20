import { CatsRepository } from './../cats/cats.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,// cat의 데이터베이스 사용을 위해 종속성 주입 레퍼지토리 사용을 위해선 모듈에 등록필요
    private jwtService: JwtService, //auth 모듈에 JwtModule에서 사용
  ) { }

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;

    // 해당하는 email이 있는지
    const cat = await this.catsRepository.findCatByEmail(email);

    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // 패스워드 검사
    const isPasswordValidated: boolean = await bcrypt.compare(  //받아온 패스워드와 모델 안 패스워드와 비교
      password, // 받아온 비번
      cat.password, // 모델 안 비밀번호와 비교
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    const payload = { email: email, sub: cat.id } //sub는 토근 제목

    return {
      token: this.jwtService.sign(payload), result: true //sign 함수로 토큰에 넣는다
    }
  }
}
