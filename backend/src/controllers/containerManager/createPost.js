import { prisma } from "../../db/prisma.js";
import { PostZodSchema } from "../../schemaTypes/index.js";

export const createPost = async (req, res) => {
   const { containerId } = req.params;
   const postSchema = PostZodSchema.safeParse(req.body);

   if (!postSchema.success) {
      return res.status(411).json({
         message: "Invalid format (title, link and contentType required)",
         error: postSchema.error.errors.map((e) => e.message),
      });
   }

   try {
      const container = await prisma.container.findUnique({
         where: {
            id: containerId,
         },
      });

      if (!container) {
         throw new Error("Container not found");
      }

      const post = await prisma.post.create({
         data: {
            title: postSchema.data.title,
            link: postSchema.data.link,
            contentType: postSchema.data.contentType,
            parentContainerId: container.id,
         },
      });

      if (!post) {
         throw new Error("Failed to create post");
      }

      res.status(200).json({
         message: "Post created successfully",
         post,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while creating post",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
