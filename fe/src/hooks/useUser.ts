import { UserData } from "@/types";
import _ from "lodash";

export const useUser = () => {
   const getUser = () => {
      const userData = localStorage.getItem("userData");

      return userData ? JSON.parse(userData) : null;
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

      return userData ? JSON.parse(userData)?.token : null;
   };

   const removeUser = () => localStorage.removeItem("userData");

   return { getUser, udpateUserToken, setUser, getToken, removeUser };
};
