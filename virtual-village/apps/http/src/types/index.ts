import z from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  password: z.string().min(3),
  type: z.enum(["user", "admin"]),
});

export const SigninSchema = z.object({
  username: z.string(),
  password: z.string().min(3),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string(),
});

export const DeleteElementSchema = z.object({
  id: z.string(),
})


export const AddElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});


export const UpdateElementSchema = z.object({
 
  imageUrl: z.string(),
 
});


export const CreateAvatarSchema = z.object({
  imageUrl: z.string(),
  name: z.string(),
});


export const CreateMapSchema = z.object({
  thumbnailUrl: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  )
});

