import { useUser } from "@/hooks/useUser";
import { SpaceData, UserData } from "@/types";
import axios from "axios";
import {
   Check,
   Ellipsis,
   Globe,
   GlobeLock,
   Link2,
   LogOut,
   Moon,
   Pencil,
   PlusCircle,
   Space,
   Sun,
   Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

interface SidebarProps {
   showSidebar: boolean;
}

const Sidebar = ({ showSidebar }: SidebarProps) => {
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
   const inputRef = useRef<HTMLInputElement>(null);
   const [isRenaming, setIsRenaming] = useState(false);

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

   const handleRenameSpace = async () => {
      if (inputRef.current && inputRef.current.value.length <= 2) {
         return toast.error("Title is too short");
      }

      try {
         const res = await axios.post(
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/rename-container`,
            {
               title: inputRef.current?.value,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         console.log(res.data);

         toast.success("Space renamed successfully");
         fetchContainers();
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to rename space");
      } finally {
         setIsRenaming(false);
      }
   };

   const handleCreateSpace = async () => {
      if (title.length < 2) {
         return toast.error("Title must contain atleast 2 letters");
      }

      try {
         const res = await axios.post(
            `${import.meta.env.VITE_BE_URL}/api/v1/create-container`,
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
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/delete-container`,
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

   const handleChangeVisibility = async (visible: boolean) => {
      try {
         const res = await axios.post(
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/toPublic`,
            {
               toPublic: visible,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         console.log(res.data);
         toast.success(
            `${res.data.updatedContainer.title} is now ${
               res.data.updatedContainer.isPublic ? "public" : "private"
            }`
         );
         fetchContainers();
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to change visibilty");
      }
   };

   const handleCopyShareLink = async (id: string) => {
      try {
         const link = `${import.meta.env.VITE_FE_URL}/s/${id}`;
         await navigator.clipboard.writeText(link);

         toast.success(`Link copied ${link}`, {
            icon: "🎉",
         });
      } catch (err) {
         console.log(err);
         toast.error("Failed to copy");
      }
   };

   const fetchContainers = async () => {
      setLoading(true);

      try {
         const res = await axios.get(
            `${import.meta.env.VITE_BE_URL}/api/v1/containers`,
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
               if (
                  err.response.data.error.message ===
                  "Token expired login again"
               ) {
                  toast.error(err.response.data.error.message);
                  return setTimeout(() => navigate("/auth"), 200);
               }

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

      navigate("/auth");
      return;
   }

   return (
      <div
         className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full hidden"
         } ${
            isDarkMode
               ? "bg-black text-white border-[#171717]"
               : "bg-white border-slate-200"
         } border-r-2 w-screen md:w-[30%] lg:w-[20%] h-full top-0 left-0 py-4 px-3 flex gap-5 flex-col `}
      >
         <div className="text-4xl font-semibold flex gap-2 items-end">
            <Space />
            <span>Pro.</span>
            <span>Space</span>
         </div>

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
               {spaces
                  .sort(
                     (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                  )
                  .map((space) => (
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
                        {isRenaming && space.id === spaceId ? (
                           <div className="flex items-center gap-2">
                              <Input
                                 type="text"
                                 ref={inputRef}
                                 placeholder={space.title}
                                 className={`border ${
                                    isDarkMode
                                       ? "border-gray-800"
                                       : "border-gray-200"
                                 }`}
                              />
                           </div>
                        ) : (
                           <span className="capitalize">{space.title}</span>
                        )}
                        {isRenaming && space.id === spaceId ? (
                           <Check
                              className="w-5 h-5 cursor-pointer"
                              onClick={handleRenameSpace}
                           />
                        ) : (
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
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                       handleChangeVisibility(!space.isPublic)
                                    }
                                 >
                                    {space.isPublic ? (
                                       <GlobeLock className="w-3 h-3" />
                                    ) : (
                                       <Globe className="w-3 h-3" />
                                    )}
                                    <span>
                                       {space.isPublic ? "Private" : "Public"}
                                    </span>
                                 </DropdownMenuItem>
                                 {space.isPublic && (
                                    <DropdownMenuItem
                                       className="cursor-pointer"
                                       onClick={() =>
                                          handleCopyShareLink(space.id)
                                       }
                                    >
                                       <Link2 className="w-3 h-3" />
                                       <span>Share</span>
                                    </DropdownMenuItem>
                                 )}
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setIsRenaming(true)}
                                 >
                                    <Pencil className="w-3 h-3" />
                                    <span>Rename</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                       handleDeleteSpace(space.title)
                                    }
                                 >
                                    <Trash className="w-3 h-3 text-red-500" />
                                    <span>Delete</span>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        )}
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
