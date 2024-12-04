import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";
import { hash, compare } from "../../scrypt";

export const router = Router();

router.post("/signup", async (req, res) => {
  // check the user
  const parsedData = SignupSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "invalid data",
    });

    return;
  }

  const hashedPassword = await hash(parsedData.data.password);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });

    res.status(200).json({
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "something went wrong internal server error or user already exists",
    });
    console.log(error);
    return;
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({
      message: "invalid data",
    });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(403).json({
        message: "user not found",
      });
      return;
    }

    const isPasswordMatch = await compare(
      parsedData.data.password,
      user.password
    );
    if (!isPasswordMatch) {
      res.status(403).json({
        message: "wrong password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD
    );

    res.status(200).json({
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong internal server error",
    });
    console.log(error);
    return;
  }
});

router.get("/elements", async (req, res) => {
  const elements = await client.element.findMany();

  res.json({
    elements: elements.map((e) => ({
      id: e.id,
      imageUrl: e.imageUrl,
      width: e.width,
      height: e.height,
      static: e.static,
    })),
  });
});

router.get("/avatars", async (req, res) => {
  const avatars = await client.avatar.findMany();
  res.json({
    avatars: avatars.map((x) => ({
      id: x.id,
      imageUrl: x.ImageUrl,
      name: x.name,
    })),
  });
});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
