import UserModel from "@/db/schemas/users";
import { Router, Request, Response } from "express";

const usersRouter = Router();

usersRouter.get("/all", (req: Request, res: Response) => {
  const users = UserModel.find();

  users.then((users) => {
    res.json({
      error: null,
      data: users,
    });
  });
});

usersRouter.get("/add", (req: Request, res: Response) => {
  const user = UserModel.create({
    name: "John Doe",
    email: "johndoe@gmail.com",
    role: "user",
    image:
      "https://pbs.twimg.com/profile_images/1666483033141280768/akStVl81_400x400.jpg",
    bio: "I am a frontend engineer",
    socials: {
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
  });

  user.then((user) => {
    res.json(user);
  });
});

export default usersRouter;
