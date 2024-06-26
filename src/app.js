import cors from "cors";
import path from "path";
import express from "express";
import { corsConfig } from "./config.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ApiError from "./helpers/ApiError.js";
import { createServer } from "http";
import { initializeSocket } from "./services/socket.js";

// creating express app
const app = express();
export const server = createServer(app);

// initialize socket
initializeSocket(server);

// configuring middleware
app.use(express.json());
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// handle api routes
app.use("/api/v1", routes);

// not found route
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Not found!",
  });
});

// middleware error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...err,
    });
  }
  console.log(err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
});

// exporting express app
export default app;
