import { Router } from "express";

const routes = new Router();

routes.post("/login", (req, res) => {
  return res.send("hello");
});

export default routes;
