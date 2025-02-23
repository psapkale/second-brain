import PostCard from "@/components/PostCard";
import { useTheme } from "@/context/themeContext";
import { useUser } from "@/hooks/useUser";
import { SpaceData } from "@/types";
import axios from "axios";
import { Skeleton } from "primereact/skeleton";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Moon, Space, Sun } from "lucide-react";

const SharedSpace = () => {
   const { spaceId } = useParams();
   const [loading, setLoading] = useState(true);
   const token = useUser().getToken();
   const [space, setSpace] = useState<SpaceData>();
   const { theme, setTheme } = useTheme();
   const isDarkMode = theme === "dark";

   const fetchContainer = async () => {
      setLoading(true);

      try {
         const res = await axios.get(
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}`,
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

   if (loading) {
      return (
         <div
            className={`w-full ${
               isDarkMode ? "bg-black text-white" : ""
            } p-10 flex items-start gap-5 flex-col`}
         >
            <Skeleton
               width="200px"
               height="20px"
               className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
            />

            <Skeleton
               width="500px"
               height="50px"
               className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
            />

            <div className="my-5 flex flex-wrap items-center justify-start gap-4">
               <Skeleton
                  width="400px"
                  height="300px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  width="600px"
                  height="300px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  width="600px"
                  height="300px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  width="400px"
                  height="300px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
            </div>
         </div>
      );
   }

   return (
      <div
         className={`w-full min-h-screen ${
            isDarkMode ? "bg-black text-white" : ""
         } p-10 flex items-start gap-2 flex-col`}
      >
         <Link
            to={"/spaces"}
            className="text-5xl font-semibold flex gap-2 items-end mb-10"
         >
            <Space />
            <span>Project </span>
            <span>Space</span>
         </Link>

         {/* User Info */}
         <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
               <img
                  src={space?.creator.imgUrl}
                  alt={space?.creator.name}
                  className="w-8 h-8 rounded-full"
               />
               <span className="text-lg fontsem">{space?.creator.name}</span>
            </div>

            <Button
               variant={isDarkMode ? "default" : "outline"}
               onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            >
               {isDarkMode ? (
                  <Sun className="w-4 h-4" />
               ) : (
                  <Moon className="w-4 h-4" />
               )}
            </Button>
         </div>

         {/* Space Info */}
         <div className="pl-2 my-3">
            <span className="text-4xl font-semibold">{space?.title}</span>
         </div>

         {/* Post */}
         <div className="flex items-center justify-start flex-wrap gap-5">
            {space?.posts.map((post) => (
               <PostCard key={post.id} post={post} shareMode={true} />
            ))}
         </div>
      </div>
   );
};

export default SharedSpace;
