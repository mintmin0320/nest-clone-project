import { Cat } from '../cats.schema';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import { AuthService } from '../../auth/auth.service';
import { HttpExceptionFilter } from '../../common/execptions/http-exception.filter';
import { CatsService } from '../services/cats.service';
import { Body, Controller, Get, Post, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CatRequestDto } from '../dto/cats.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService, //디펜더시 인젝션을 하려면 모듈에서 임포트해야함
  ) { }

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard) //여기서 인증처리
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    return cat;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: 'Success!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입 ' }) // swagger에 설명 추가하기 위함!
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @ApiOperation({ summary: '고양이 이미지 업로드' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions("cats"))) //프론트에서 키 인자로 이미지보내는 것, 두번째는 파일갯수제한, cats라는 폴더안에 업로드 파일을 저장한다.
  @UseGuards(JwtAuthGuard)
  //@UseInterceptors(FileInterceptor('imgae'))  이미지 하나만받는법
  @Post('upload')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() cat: Cat) {
    console.log(files)
    //return { imagae: `http://localhost:8000/media/cats/${files[0].filename}` };
    return this.catsService.uploadImg(cat, files); //첫번째인자는 현재로그인된정보->jwt토큰 디코딩
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat()
  }
}
