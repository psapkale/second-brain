import { useTheme } from "@/context/themeContext";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const SharedSpace = () => {
   const { spaceId } = useParams();
   const [loading, setLoading] = useState(true);
   const token = useUser().getToken();
   const [space, setSpace] = useState();
   const { theme } = useTheme();
   const isDarkMode = theme === "dark";

   const fetchContainer = async () => {
      setLoading(true);

      try {
         const res = await axios.get(
            `http://localhost:8080/api/v1/${spaceId}`,
            {
               headers: {
                  Authorization: `Beared ${token}`,
               },
            }
         );

         setSpace(res.data.container);
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to fetch spaces");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchContainer();
   }, [spaceId]);

   return <div>{JSON.stringify(space)}</div>;
};

export default SharedSpace;
