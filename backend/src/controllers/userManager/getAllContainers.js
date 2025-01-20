import { prisma } from "../../db/prisma.js";

export const getAllContainers = async (req, res) => {
   const { email } = req.userData;

   try {
      const user = await prisma.user.findUnique({
         where: {
            email,
         },
         include: {
            containers: true,
         },
      });

      if (!user) {
         throw new Error("Error fetching user details");
      }

      res.status(200).json({
         message: `Spaces of ${user.name}`,
         containers: user.containers,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while fetching containers",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
