import { NextFunction, Request, Response } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {

    res.on('finish', () => {  // res가 완료 됐을 때 'finish'는 이벤트임
      this.logger.log(`${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl);
    })
    next();
  }
}
