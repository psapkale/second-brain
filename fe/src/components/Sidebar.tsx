import { useUser } from "@/hooks/useUser";
import { SpaceData, UserData } from "@/types";
import axios from "axios";
import { Ellipsis, LogOut, Moon, PlusCircle, Sun, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "primereact/skeleton";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "@/context/themeContext";

const Sidebar = () => {
   const { getUser, getToken, removeUser } = useUser();
   const user: UserData = getUser();
   const token: string = getToken();
   const navigate = useNavigate();
   const { spaceId } = useParams();
   const { theme, setTheme } = useTheme();
   const isDarkMode = theme === "dark";
   const [spaces, setSpaces] = useState<SpaceData[]>([]);
   const [title, setTitle] = useState("");
   const [loading, setLoading] = useState<boolean>(true);
   const [isOpen, setIsOpen] = useState(false);

   const handleSignOut = async () => {
      try {
         await removeUser();
         navigate("/auth");

         toast.success("See you soon", {
            icon: "😿",
         });
      } catch (err) {
         console.log(err);

         toast.error("Failed to sign out");
      }
   };

   const handleCreateSpace = async () => {
      if (title.length < 2) {
         return toast.error("Title must contain atleast 2 letters");
      }

      try {
         const res = await axios.post(
            "http://localhost:8080/api/v1/create-container",
            {
               title: title,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         console.log(res.data);

         toast.success("Space created successfully", {
            icon: "✅",
         });

         fetchContainers();
         setIsOpen(false);
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to create space");
      }
   };

   const handleDeleteSpace = async (spaceTitle: string) => {
      try {
         const res = await axios.delete(
            `http://localhost:8080/api/v1/${spaceId}/delete-container`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         console.log(res.data);

         toast.success(`${spaceTitle} deleted successfully`, {
            icon: "🚮",
         });
         fetchContainers();
         navigate("/spaces");
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error(`Failed to delete ${spaceTitle}`);
      }
   };

   const fetchContainers = async () => {
      setLoading(true);

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

      navigate("/login");
      return;
   }

   return (
      <div
         className={`${
            isDarkMode
               ? "bg-black text-white border-[#171717]"
               : "bg-white border-slate-200"
         } border-r-2 w-[20%] h-full top-0 left-0 py-4 px-3 flex gap-5 flex-col`}
      >
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

         {/* Theme */}
         <div className="flex items-center gap-3">
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
            <Button
               variant={isDarkMode ? "default" : "outline"}
               className="flex items-center"
               onClick={handleSignOut}
            >
               <span>Sign out</span>
               <LogOut />
            </Button>
         </div>

         {/* Spaces container */}
         {loading ? (
            <div className="flex gap-2 flex-col">
               <Skeleton
                  height="30px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  height="30px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  height="30px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  height="30px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
               <Skeleton
                  height="30px"
                  className={`${isDarkMode ? "bg-[#0e1114]" : ""}`}
               />
            </div>
         ) : (
            <div className="flex gap-2 flex-col">
               {spaces.map((space) => (
                  <Link
                     key={space.id}
                     to={`/spaces/${space.id}`}
                     className={`py-1 px-2 flex items-center justify-between rounded-sm ${
                        isDarkMode
                           ? "hover:bg-[#171717] text-white"
                           : "hover:bg-slate-100"
                     }`}
                     style={{
                        backgroundColor:
                           spaceId === space.id
                              ? isDarkMode
                                 ? "#171717"
                                 : "#f1f5f9"
                              : "",
                     }}
                  >
                     <span className="capitalize">{space.title}</span>
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <Ellipsis
                              className="w-4 h-4"
                              style={{
                                 opacity: spaceId === space.id ? 1 : 0,
                              }}
                           />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           className={`${
                              isDarkMode
                                 ? "bg-black text-white border-slate-800"
                                 : ""
                           }`}
                        >
                           <DropdownMenuItem className="cursor-pointer">
                              {space.isPublic ? "Private" : "Public"}
                           </DropdownMenuItem>
                           <DropdownMenuItem className="cursor-pointer">
                              Rename
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteSpace(space.title)}
                           >
                              <Trash className="w-3 h-3 text-red-500" />
                              <span>Delete</span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </Link>
               ))}
            </div>
         )}

         <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger asChild>
               <Button
                  variant={isDarkMode ? "default" : "outline"}
                  onClick={() => setIsOpen(true)}
               >
                  <PlusCircle />
                  <span>Create Space</span>
               </Button>
            </DialogTrigger>
            <DialogContent
               className="sm:max-w-[425px]"
               style={{
                  color: isDarkMode ? "white" : "",
                  backgroundColor: isDarkMode ? "black" : "",
                  border: isDarkMode ? "1px solid #272727" : "",
               }}
            >
               <DialogHeader>
                  <DialogTitle>Create Space</DialogTitle>
                  <DialogDescription>
                     Create a independent space to organize the internet.
                  </DialogDescription>
               </DialogHeader>
               <div>
                  <Input
                     type="text"
                     placeholder="Title"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     style={{
                        border: isDarkMode ? "1px solid #272727" : "",
                     }}
                  />
               </div>
               <DialogFooter>
                  <Button onClick={handleCreateSpace}>
                     <PlusCircle />
                     <span>Create Space</span>
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default Sidebar;
