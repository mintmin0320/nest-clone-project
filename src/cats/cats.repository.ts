import { CatRequestDto } from './dto/cats.request.dto';
import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cats.schema';

export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) { }

  async existByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email });
    if (result) return true;
    else return false;
  }

  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}

//이걸 서비스에서 처리하면 디비가 바뀌는 경우 서비스들을 다 수정해야하지만
// 서비스에서 레퍼지토리 안에 있는 함수를 사용하게 되면 변경 시
// 여기서만 변경하면됨 레퍼지토리 패턴은 디비가 전환될 수도 있는
//경우에 선택해서 사용 서비스에서 바로 사용해도됨.