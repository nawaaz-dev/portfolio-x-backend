import { Router, Request, Response } from "express";
import PostModel from "@/db/schemas/posts";
import UserModel from "@/db/schemas/users";
import { IPostComment, IPostCommon } from "@nawaaz-dev/portfolio-types";

const postsRouter = Router();

postsRouter.get("/", async (req: Request, res: Response) => {
  const posts = await PostModel.find().lean();
  const users = await UserModel.find();

  const postsData = (posts as unknown as IPostCommon[]).map((post) => {
    const commentsWithUsers = post.actions.comments.map((comment) => {
      const user = users.find((user) => user._id.equals(comment.userId));

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
  });

  return res.json({
    error: null,
    data: postsData,
  });
});

postsRouter.get("/add", (req: Request, res: Response) => {
  const post = PostModel.create({
    tab: "experience",
    title: "Frontend Engineer",
    image: "https://placehold.co/150",
    time: "Jan 2024 - Oct 2024",
    details: {
      company: "Kapstan Infra",
      location: "Remote (India/USA)",
      roles: [
        "💻 Worked on a project that involved building a web application for a client.",
        "⚛️ Developed the frontend using React, Redux, and TypeScript.",
        "🔗 Worked with the backend team to integrate the frontend with the backend.",
      ],
    },
    actions: {
      likes: 0,
      comments: [
        {
          userId: "67b589bfed86a280bd2a82cc",
          text: "Great work!",
          timestamp: new Date(),
        },
        {
          userId: "67b589bfed86a280bd2a82cc",
          text: "Work great!",
          timestamp: new Date(),
        },
      ],
      shares: 0,
    },
  });

  post.then((post) => {
    res.json(post);
  });
});

postsRouter.post("/:postId/like", (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = PostModel.findById(postId);

  post.then((post) => {
    if (!post) {
      res.json({
        error: "Post not found",
        data: null,
      });
      return;
    }

    post.actions.likes += 1;
    post.save();

    res.json({
      error: null,
      data: post,
    });
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
