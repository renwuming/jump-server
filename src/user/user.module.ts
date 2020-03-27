import { Module, HttpModule } from '@nestjs/common';
import { UserController } from './user.controller';
// import { UserModel, UserSchema } from '../models/user.model';
import { ConfigModule } from '../config/config.module';
import { UserService } from './user.service';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    // UserModel,
    HttpModule,
    ConfigModule,
    // TypegooseModule.forFeature([UserSchema]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
