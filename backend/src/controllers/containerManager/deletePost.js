import { prisma } from "../../db/prisma.js";

export const deletePost = async (req, res) => {
   const { containerId, postId } = req.params;

   if (!containerId || !postId) {
      throw new Error("container id or post id not provided in the url");
   }

   try {
      let post = await prisma.post.findUnique({
         where: {
            id: postId,
            parentContainerId: containerId,
         },
      });

      if (!post) {
         throw new Error("Post not found");
      }

      post = await prisma.post.delete({
         where: {
            id: postId,
            parentContainerId: containerId,
         },
      });

      if (!post) {
         throw new Error("Failed to delete  post");
      }

      res.status(200).json({
         message: "Post deleted successfully",
         post,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while deleting container",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
