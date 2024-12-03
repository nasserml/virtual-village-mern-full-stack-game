import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";

export const router = Router();

router.post("/signup", (req, res) => {
  res.status(200).json({
    message: "signup",
  });
});

router.post("/signin", (req, res) => {
  res.status(200).json({
    message: "signin",
  });
});

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
