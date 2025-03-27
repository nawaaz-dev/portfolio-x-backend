import { Router, Request, Response } from "express";
import PostModel from "@/db/schemas/posts";
import UserModel from "@/db/schemas/users";
import { IPostComment, IPostCommon, User } from "@nawaaz-dev/portfolio-types";
import {
  educationData,
  experienceData,
  projectData,
  techStackData,
} from "@/db/raw-data";
import mongoose from "mongoose";

const postsRouter = Router();

const appendUserInfo = (post: IPostCommon, users: User[]) => {
  console.log(post);
  const commentsWithUsers = post.actions.comments.map((comment) => {
    const user = users.find((user) => (user._id as any).equals(comment.userId));

    return {
      ...comment,
      userInfo: {
        name: user?.name ?? "",
        image: user?.image ?? "",
      },
    };
  });

  return {
    ...post,
    actions: {
      ...post.actions,
      comments: commentsWithUsers,
    },
  };
};

postsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().lean();
    const users = (await UserModel.find().lean()) as unknown as User[];
    console.log(users);

    const postsData = (posts as unknown as IPostCommon[]).map((post) => {
      const postWithUserInfo = appendUserInfo(post, users);
      console.log("postWithUserInfo", postWithUserInfo);
      return postWithUserInfo;
    });

    postsData.sort((a, b) => {
      return (
        new Date(b.time.start).getTime() - new Date(a.time.start).getTime()
      );
    });

    return res.json({
      error: null,
      data: postsData,
    });
  } catch (error: any) {
    return res.json({
      error: error.message,
      data: null,
    });
  }
});

postsRouter.get("/add", async (req: Request, res: Response) => {
  // get all posts
  mongoose.connection.db?.dropCollection("posts");

  // const allPosts = PostModel.find();
  // // remove all posts
  // allPosts.deleteMany();
  // add new post
  await PostModel.create(experienceData);
  await PostModel.create(techStackData);
  await PostModel.create(projectData);
  await PostModel.create(educationData);

  res.json({
    error: null,
    data: null,
  });

  // res.end();
});

/**
 * TODO: Improve code quality
 */
postsRouter.post("/:postId/like", async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = (await PostModel.findById(
    postId
  ).lean()) as unknown as IPostCommon;
  const users = (await UserModel.find().lean()) as unknown as User[];

  if (!post) {
    res.json({
      error: "Post not found",
      data: null,
    });
    return;
  }

  await PostModel.updateOne(
    { _id: postId },
    {
      $set: {
        "actions.likes": post.actions.likes + 1,
      },
    }
  );

  res.json({
    error: null,
    data: appendUserInfo(
      (await PostModel.findById(postId).lean()) as unknown as IPostCommon,
      users
    ),
  });
});

postsRouter.post("/:postId/comment", async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const comment = req.body.comment as IPostComment;
  const post = PostModel.findById(postId);
  // const users = await UserModel.findById(comment.userId);

  post.updateOne({
    $push: {
      "actions.comments": {
        userId: "67b589bfed86a280bd2a82cc",
        text: comment.text,
        timestamp: comment.timestamp,
      },
    },
  });

  post.then((post) => {
    res.json({
      error: null,
      data: post,
    });
  });
});

export default postsRouter;
