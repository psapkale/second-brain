import { prisma } from "../../db/prisma.js";

export const validateOwner = async (req, id) => {
   const { email } = req.userData;

   const user = await prisma.user.findUnique({
      where: {
         email,
      },
   });

   if (!user) {
      return Error("Error fetching user details");
   }

   if (user.id !== id) {
      return Error("Unauthorized to perform action");
   }

   return null;
};
