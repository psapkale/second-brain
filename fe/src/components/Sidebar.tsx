import { useUser } from "@/hooks/useUser";
import { SpaceData, UserData } from "@/types";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Sidebar = () => {
   const { getUser, getToken } = useUser();
   const user: UserData = getUser();
   const token: string = getToken();
   const navigate = useNavigate();
   const [spaces, setSpaces] = useState<SpaceData[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   const fetchContainers = async () => {
      try {
         const res = await axios.get(
            "http://localhost:8080/api/v1/containers",
            {
               headers: {
                  Authorization: `Beared ${token}`,
               },
            }
         );

         setSpaces(res.data.containers);
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
      fetchContainers();
   }, []);

   if (!user && !token) {
      toast.error("Please login to access Spaces");

      return navigate("/login");
   }

   return (
      <div className="border-r border-black w-[23%] py-4 px-3 flex gap-5 flex-col">
         <span className="text-4xl font-semibold">Second Brain</span>

         {/* User info */}
         <div className="flex items-center gap-2">
            <img
               src={user.imgUrl}
               alt={user.name}
               className="w-8 rounded-full object-cover"
            />
            <span>{user.name}'s Spaces</span>
         </div>

         {/* Spaces container */}
         {loading ? (
            <div>be hold..</div>
         ) : (
            <div className="flex gap-2 flex-col">
               {spaces.map((space) => (
                  <Link
                     to={`/spaces/${space.id}`}
                     key={space.id}
                     className="py-1 px-2 rounded-sm hover:bg-slate-100"
                  >
                     {space.title}
                  </Link>
               ))}
            </div>
         )}

         <button className="w-full bg-black text-white rounded-lg py-2 px-4 cursor-pointer">
            <PlusCircle />
         </button>
      </div>
   );
};

export default Sidebar;
