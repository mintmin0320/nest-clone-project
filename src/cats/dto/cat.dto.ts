import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

export class ReadOnlyCatDto extends PickType(Cat, ['email', 'name'] as const) {
  // pickType : 필요한것만 가져옴
  @ApiProperty({  //swagger에서 데이터 입력 예시 형태를 제공
    example: '20233543',
    description: 'id',
  })
  id: string;
}