import {
  Controller,
  Get,
  Post,
  Body,
  HttpService,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as qs from 'querystring';
import WXBizDataCrypt from './WXBizDataCrypt';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Auth } from '../auth/auth.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getUserInfo(@Auth() auth) {
    return this.userService.getUserInfo(auth);
  }

  @Post('/login')
  async login(@Body() body) {
    const { code } = body;
    const config = this.configService.getAppConfig();
    const { AppID, AppSecret } = config;

    const requestBody = {
      appid: AppID,
      secret: AppSecret,
      js_code: code,
      grant_type: 'authorization_code',
    };
    try {
      const result = await this.httpService
        .post(
          'https://api.weixin.qq.com/sns/jscode2session',
          qs.stringify(requestBody),
        )
        .toPromise()
        .then(res => res.data);
      if (!result.errcode) {
        const ticket = WXBizDataCrypt.randomKey();
        const cache = this.configService.getCache();
        cache.set(ticket, result);
        this.userService.updateUserInfo(result, result);
        return {
          ticket,
        };
      } else {
        throw new UnprocessableEntityException('登录失败');
      }
    } catch (error) {
      throw new UnprocessableEntityException('登录失败');
    }
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async updateUserInfo(@Auth() auth, @Body() body) {
    return this.userService.updateUserInfo(auth, body);
  }

  @Get('/rank')
  @UseGuards(AuthGuard)
  async getRank(@Auth() auth) {
    const rankData = await this.userService.getRank(auth);
    return {
      rankData,
    };
  }
}
