import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from './auth/auth.module';
import { mongoose } from '@typegoose/typegoose';

(async () => {
  await mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'jump',
  });
})();

@Global()
@Module({
  imports: [
    UserModule,
    TypegooseModule.forRoot('mongodb://localhost:27017/jump'),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
