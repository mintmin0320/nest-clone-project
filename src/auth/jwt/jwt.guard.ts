import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Strategy가 여 guard에서 실행됨
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }