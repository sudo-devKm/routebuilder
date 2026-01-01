import { model, Schema } from 'mongoose';

export interface IPost {
  title: string;
  description: string;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Please Provide title'],
  },
  description: {
    type: String,
    required: [true, 'Please Provide description'],
  },
});

export const Post = model<IPost>('posts', postSchema);
