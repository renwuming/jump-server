import { Injectable } from '@nestjs/common';
import { appConfig } from './appConfig';
import * as Cache from 'node-cache';

@Injectable()
export class ConfigService {
  cache = new Cache();
  getAppConfig() {
    return appConfig;
  }
  getCache() {
    return this.cache;
  }
}
