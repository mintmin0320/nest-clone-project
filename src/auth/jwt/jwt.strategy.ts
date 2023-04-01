import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { CatsRepository } from './../../cats/cats.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {//인증을 할때사용함
  constructor(private readonly catsRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpriration: false, //만료기간
    });
  }

  async validate(payload: Payload) { //인증 가드가 실행되면 이 부분 실행
    const cat = await this.catsRepository.findCatByIdWithoutPassword(
      payload.sub,
    );

    if (cat) {
      return cat; //request.user에 cat이 들어감
    } else {
      throw new UnauthorizedException('접근 오류')
    }
  }
}