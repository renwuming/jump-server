import { prop, getModelForClass } from '@typegoose/typegoose';

export class UserSchema {
  _id?: string;
  @prop()
  openid: string;
  @prop()
  session_key: string;
  @prop()
  score: number;
  @prop()
  userInfo: any;
}

export const UserModel = getModelForClass(UserSchema, {
  schemaOptions: {
    collection: 'user',
    timestamps: true,
  },
});
