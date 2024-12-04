import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import {
  AddElementSchema,
  CreateElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";
import client from "@repo/db/client";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation failed",
    });
    return;
  }

  if (!parsedData.data.mapId) {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: +parsedData.data.dimensions.split("x")[0],
        height: +parsedData.data.dimensions.split("x")[1],
        creatorId: req.userId as string,
      },
    });
    res.json({
      spaceId: space.id,
    });
    return;
  }

  const map = await client.map.findUnique({
    where: {
      id: parsedData.data.mapId,
    },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });

  if (!map) {
    res.status(400).json({
      message: "Map not found",
    });
    return;
  }

  const space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId as string,
      },
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x!,
        y: e.y!,
      })),
    });
    return space;
  });

  res.json({
    spaceId: space.id,
  });
});

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    select: {
      creatorId: true,
    },
  });

  if (!space) {
    res.status(400).json({
      message: "Space not found",
    });
    return;
  }

  if (space?.creatorId !== req.userId) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  await client.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });
  res.json({
    message: "Space deleted",
  });
});

spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId as string,
    },
  });

  res.json({
    spaces: spaces.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`,
    })),
  });
});

spaceRouter.post("/element", userMiddleware, async (req, res) => {
  const parsedData = AddElementSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation failed",
    });
    return;
  }

  const space = await client.space.findUnique({
    where: {
      id: req.body.spaceId,
      creatorId: req.userId!,
    },
    select: {
      width: true,
      height: true,
    },
  });

  if (!space) {
    res.status(400).json({
      message: "Space not found",
    });
    return;
  }

  await client.spaceElements.create({
    data: {
      spaceId: req.body.spaceId,
      elementId: parsedData.data.elementId,
      x: parsedData.data.x,
      y: parsedData.data.y,
    },
  });

  res.json({ message: "Element Added" });
});

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation failed",
    });
    return;
  }

  const spaceElement = await client.spaceElements.findFirst({
    where: {
      id: parsedData.data.id,
    },
    include: {
      space: true,
    },
  });

  if (
    !spaceElement?.space.creatorId ||
    spaceElement?.space.creatorId !== req.userId
  ) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  await client.spaceElements.delete({
    where: {
      id: parsedData.data.id,
    },
  });
  res.json({ message: "Element deleted" });
});

spaceRouter.get("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    include: {
      spaceElements: {
        include: {
            element:true
        }
      },
    },
  });

  if (!space) {
    res.status(400).json({
      message: "Space not found",
    });
    return;
  }

  res.json({
    "dimensions": `${space.width}x${space.height}`,
    elements: space.spaceElements.map((e) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static
      },
      x: e.x,
      y: e.y,
    })),
  });
});