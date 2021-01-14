import { v4 as uuid } from "uuid";

export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends ITimestamp {
  id: string;
  title: string;
}

export interface IPostInput {
  title: string;
}

export interface IUpdatePostInput {
  id: string;
  title?: string;
}

export class Post implements IPost {
  public id: string;
  public title: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(input: IPostInput) {
    this.id = uuid();
    this.title = input.title;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
