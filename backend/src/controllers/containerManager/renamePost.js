import { prisma } from "../../db/prisma.js";
import { validateOwner } from "../auth/validateOwner.js";

export const renamePost = async (req, res) => {
   const { containerId, postId } = req.params;
   const { title } = req.body;

   if (!containerId || !postId) {
      throw new Error("container id or post id not provided in the url");
   }

   if (title?.length <= 2) {
      return res.status(411).json({
         message: "Title is too short",
      });
   }

   try {
      let container = await prisma.container.findUnique({
         where: {
            id: containerId,
         },
      });

      if (!container) {
         throw new Error("Container not found");
      }

      const notOwnerErr = validateOwner(req, container.creatorId);

      if (notOwnerErr) {
         throw await notOwnerErr;
      }

      let post = await prisma.post.findUnique({
         where: {
            id: postId,
            parentContainerId: containerId,
         },
      });

      if (!post) {
         throw new Error("Post not found");
      }

      post = await prisma.post.update({
         where: {
            id: postId,
         },
         data: {
            title,
         },
      });

      if (!post) {
         throw new Error("Failed to rename container");
      }

      res.status(200).json({
         message: "Post renamed successfully",
         post,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while renaming post",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
