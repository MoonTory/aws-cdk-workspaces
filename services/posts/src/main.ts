import { AppSyncResolverHandler } from "aws-lambda";
import { PostModel, Post, IPostInput, IUpdatePostInput } from "/opt/nodejs/models";
import { createConnection, MongoConnectionOrNull } from "/opt/nodejs/mongo-utils";

let conn: MongoConnectionOrNull = null;

const uri = process.env.MONGO_URI as string;

type AppSyncEventArgs = {
  PostId: string;
  PostInput: IPostInput;
  UpdatePostInput: IUpdatePostInput;
};

export const handler: AppSyncResolverHandler<AppSyncEventArgs, any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = true; // used to preserve the mongodb connection.

  conn = await createConnection(uri, conn);

  switch (event.info.fieldName) {
    case "listPosts":
      return await listPosts();
    case "getPostById":
      return await getPostById(event.arguments.PostId);
    case "createPost":
      return await createPost(event.arguments.PostInput);
    case "updatePost":
      return await updatePost(event.arguments.UpdatePostInput);
    case "deletePost":
      return await deletePost(event.arguments.PostId);
    default:
      return null;
  }
};

const listPosts = async () => {
  try {
    const docs = await PostModel.find({});

    return docs;
  } catch (error) {
    return [];
  }
};

const updatePost = async (input: IUpdatePostInput) => {
  try {
    const doc = await PostModel.findOneAndUpdate({ id: input.id }, input, {
      new: true,
    });

    return doc;
  } catch (error) {
    return null;
  }
};

const deletePost = async (postId: string) => {
  try {
    const doc = await PostModel.deleteOne({ id: postId });

    console.log("doc", doc);

    return "Post deleted";
  } catch (error) {
    return "Could not delete Post";
  }
};

const getPostById = async (postId: string) => {
  try {
    const doc = await PostModel.findOne({ id: postId });

    return doc;
  } catch (error) {
    return null;
  }
};

const createPost = async (input: IPostInput) => {
  try {
    const post = new Post(input);

    const doc = await PostModel.create(post);

    if (doc?.id !== post.id) return null;

    return post;
  } catch (error) {
    return null;
  }
};
