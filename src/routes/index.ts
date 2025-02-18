import { Router, Request, Response } from "express";
import PostModel from "src/db/schemas/posts";

const rootRouter = Router();

/* GET home page. */
rootRouter.get("/", (req: Request, res: Response) => {
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
  });

  post.then((post) => {
    res.json(post);
  });
});

export default rootRouter;
