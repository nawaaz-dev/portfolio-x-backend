import { Router, Request, Response } from "express";
import PostModel from "@/db/schemas/posts";

const postsRouter = Router();

postsRouter.get("/", (req: Request, res: Response) => {
  const posts = PostModel.find();

  posts.then((posts) => {
    res.json({
      error: null,
      data: posts,
    });
  });
});

postsRouter.post("/:postId/like", (req: Request, res: Response) => {
  const postId = req.body.postId;
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

export default postsRouter;
