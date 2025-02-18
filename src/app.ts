import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import connectDB from "./db/connect";
import rootRouter from "./routes";

const app = express();

connectDB();

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" })); // Adjust the limit as needed
app.use(
  express.urlencoded({ extended: true, limit: "100mb", parameterLimit: 100000 })
);
app.use(cookieParser());
app.use(cors());

app.use(express.static("public"));

app.use("/", rootRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: true,
    message: "Error",
  });
});

export default app;
