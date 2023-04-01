import { CatRequestDto } from './dto/cats.request.dto';
import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cats.schema';

export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) { }

  async findAll() {
    return await this.catModel.find();
  }

  async findByIdAndUploadImg(id: any, fileName: string) {
    const cat = await this.catModel.findById(id);

    cat.imgUrl = `http://localhost:8000/media/${fileName}`;

    const newCat = await cat.save(); //업데이트된것을 저장
    console.log(newCat);
    return newCat.readOnlyData; //필요한 필드만 리턴
  }

  async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
    const cat = await this.catModel.findById(catId).select('-password') //select는 원하는 필드를 고를 수 있다 마이너스 하면 그것을 제외하고 email name 이런식으로 공백으로 구분
    return cat;
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

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