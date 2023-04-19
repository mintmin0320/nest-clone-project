import { CatsRepository } from '../cats.repository';
import { CatRequestDto } from '../dto/cats.request.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cat } from '../cats.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catsModel: Model<Cat>,
    private readonly catsRepository: CatsRepository,
  ) { }

  async getAllCat() { //모든 캣을 디비에서 꺼내와서 반환x 필요한것만
    const allCat = await this.catsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    return readOnlyCats;
  }

  async searchInfo(id: string) {
    try {
      const user = await this.catsModel.findById(id);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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

    return { data: cat.readOnlyData, result: true };
  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`; //파일에 첫번째인자에 파일네임이찍힌다
    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUploadImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }
}
