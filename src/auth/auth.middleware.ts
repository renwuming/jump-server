import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthType } from './auth.interface';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: any, res: any, next: () => void) {
    const ticket = req.headers['x-ticket'];
    const auth = this.getDataByTicket(ticket);
    // const { openid } = auth;
    // const user = await UserModel.findOne({
    //   openid,
    // });
    req['auth'] = auth;
    next();
  }

  // 根据ticket获取用户信息
  getDataByTicket(ticket): AuthType {
    const cache = this.configService.getCache();
    if (ticket) {
      const auth: AuthType = cache.get(ticket);
      if (auth) {
        return auth;
      }
    }
    return null;
  }
}
