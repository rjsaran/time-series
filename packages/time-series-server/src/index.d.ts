import { Request } from 'express';

export interface IAppUser {
  id: string;
}

export interface RequestWithUser extends Request {
  user: IAppUser;
}
