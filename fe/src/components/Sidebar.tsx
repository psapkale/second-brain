import { useUser } from "@/hooks/useUser";
import { SpaceData, UserData } from "@/types";
import axios from "axios";
import { Ellipsis, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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

const Sidebar = () => {
   const { getUser, getToken } = useUser();
   const user: UserData = getUser();
   const token: string = getToken();
   const navigate = useNavigate();
   const { spaceId } = useParams();
   const [spaces, setSpaces] = useState<SpaceData[]>([]);
   const [title, setTitle] = useState("");
   const [loading, setLoading] = useState<boolean>(true);
   const [isOpen, setIsOpen] = useState(false);

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

      return navigate("/login");
   }

   return (
      <div className="border-r-2 border-slate-200 w-[20%] h-full  top-0 left-0 py-4 px-3 bg-white flex gap-5 flex-col">
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
                     key={space.id}
                     to={`/spaces/${space.id}`}
                     className="py-1 px-2 flex items-center justify-between rounded-sm hover:bg-slate-100"
                     style={{
                        backgroundColor: spaceId === space.id ? "#f1f5f9" : "",
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
                        <DropdownMenuContent>
                           <DropdownMenuItem>
                              {space.isPublic ? "Private" : "Public"}
                           </DropdownMenuItem>
                           <DropdownMenuItem>Rename</DropdownMenuItem>
                           <DropdownMenuItem
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
               <Button variant="outline" onClick={() => setIsOpen(true)}>
                  <PlusCircle />
                  <span>Create Space</span>
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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
