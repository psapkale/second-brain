import { UserData } from "@/types";
import _ from "lodash";

export const useUser = () => {
   const getUser = () => {
      const userData = localStorage.getItem("userData");

      if (userData) {
         const { createdAt, ...rest } = JSON.parse(userData);

         // 28 days
         if (_.now() - createdAt >= 28 * 24 * 60 * 60 * 1000) {
            removeUser();
            return null;
         }

         return { ...rest, createdAt };
      }

      return null;
   };

   const udpateUserToken = (token: string) => {
      const userData = getUser();

      if (userData) {
         localStorage.setItem(
            "userData",
            JSON.stringify({ ...userData, token, createdAt: _.now() })
         );
      }
   };

   const setUser = (userData: UserData) => {
      return localStorage.setItem("userData", JSON.stringify(userData));
   };

   const getToken = () => {
      const userData = localStorage.getItem("userData");

      if (userData) {
         const { token, createdAt } = JSON.parse(userData);

         // 28 days
         if (_.now() - createdAt >= 28 * 24 * 60 * 60 * 1000) {
            removeUser();
            return null;
         }

         return token;
      }

      return null;
   };

   const removeUser = () => localStorage.removeItem("userData");

   return { getUser, udpateUserToken, setUser, getToken, removeUser };
};
