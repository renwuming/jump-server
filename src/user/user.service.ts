import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { ConfigService } from '../config/config.service';
import { AuthType } from '../auth/auth.interface';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  async updateUserInfo(auth, data) {
    const { openid } = auth;
    const oldData = await this.getUserInfo(auth);
    const updateData = this.handleUpdateData(data, oldData);
    await UserModel.findOneAndUpdate(
      {
        openid,
      },
      updateData,
      {
        new: true,
        upsert: true,
      },
    );
  }

  handleUpdateData(data, oldData) {
    const updateData = _.pickBy(data, value => !!value);
    const { score } = updateData;
    if (score && oldData.score) {
      if (+score < oldData.score) delete updateData.score;
    }
    return updateData;
  }

  async getUserInfo(auth: AuthType) {
    const { openid } = auth;
    const user = await UserModel.findOne(
      {
        openid,
      },
      {
        score: 1,
        userInfo: 1,
      },
    ).lean();

    return user;
  }

  // 根据ticket获取用户信息
  getDataByTicket(ticket) {
    const cache = this.configService.getCache();
    if (ticket) {
      const auth = cache.get(ticket);
      if (auth) {
        return auth;
      } else {
        throw new UnauthorizedException('登录过期');
      }
    } else {
      throw new UnauthorizedException('登录过期');
    }
  }

  // 获取排行榜
  async getRank(auth: AuthType) {
    const list = await UserModel.find(
      {},
      {
        score: 1,
        userInfo: 1,
      },
    )
      .sort({
        score: -1,
      })
      .limit(100)
      .lean();

    const userData = await this.getUserInfo(auth);
    const index = list
      .map(item => item.userInfo._id)
      .indexOf(userData.userInfo._id);

    const rank = index < 0 ? '未上榜' : index;

    return {
      rankList: list.slice(0, 10),
      rank,
    };
  }
}
