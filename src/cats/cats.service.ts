import { CatsRepository } from './cats.repository';
import { CatRequestDto } from './dto/cats.request.dto';
import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cats.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) { }

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existByEmail(email); // 이메일필드를 검사해서 중복체크
    if (isCatExist) {
      throw new UnauthorizedException('해당 고양이는 이미 존재');// 필터로 넘어가 예외처리됨
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword
    });

    return cat.readOnlyData;
  }
}
