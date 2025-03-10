import { useUser } from "@/hooks/useUser";
import { ContentType, PostData } from "@/types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "primereact/skeleton";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import PostCard from "./PostCard";
import { useTheme } from "@/context/themeContext";
import { useSidebar } from "@/context/sidebarContext";

const SpaceController = () => {
   const { showSidebar } = useSidebar();
   const { spaceId } = useParams();
   const token = useUser().getToken();
   const { theme } = useTheme();
   const isDarkMode = theme === "dark";
   const [posts, setPosts] = useState<PostData[]>([]);
   const [title, setTitle] = useState("");
   const [isOpen, setIsOpen] = useState(false); // for modal
   const [link, setLink] = useState("");
   const contentTypes = useRef<ContentType[]>([
      "TWITTER",
      "YOUTUBE",
      "INSTAGRAM",
   ]);
   const [contentType, setContentType] = useState<ContentType>("TWITTER");
   const [loading, setLoading] = useState(true);

   const validateLink = (link: string, contentType: ContentType) => {
      if (contentType === "TWITTER") {
         if (
            link.startsWith("https://x.com/") ||
            link.startsWith("https://www.x.com/") ||
            link.startsWith("https://twitter.com/") ||
            link.startsWith("https://www.twitter.com/")
         ) {
            const match = link.match(/status\/(\d+)/);

            return match ? true : false;
         }
      }

      if (contentType === "YOUTUBE") {
         return (
            link.startsWith("https://www.youtube.com/") ||
            link.startsWith("https://youtube.com/") ||
            link.startsWith("https://www.youtu.be/") ||
            link.startsWith("https://youtu.be/")
         );
      }

      if (contentType === "INSTAGRAM") {
         return (
            link.startsWith("https://www.instagram.com/") ||
            link.startsWith("https://instagram.com/")
         );
      }

      return false;
   };

   const handleCreatePost = async () => {
      if (title.length < 2) {
         return toast.error("Title must contain atleast 2 letters");
      }

      try {
         // todo validate link
         if (!validateLink(link, contentType)) {
            return toast.error(
               `Link not a ${contentType.toLowerCase()} link/post`
            );
         }

         const res = await axios.post(
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/create-post`,
            {
               title,
               link,
               contentType,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setPosts(res.data.posts);
         toast.success("Post added successfully", { icon: "🎉" });
         setIsOpen(false);
         fetchPosts();
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to add post");
      }
   };

   const handleDeletePost = async (post: PostData) => {
      try {
         const res = await axios.delete(
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/delete-post/${
               post.id
            }`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         console.log(res.data);

         toast.success(`${post.title} deleted successfully`, {
            icon: "🚮",
         });
         fetchPosts();
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error(`Failed to delete ${post.title}`);
      }
   };

   const handleRenamePost = async (postId: string, title: string) => {
      if (title.length <= 2) {
         return toast.error("Title is too short");
      }

      try {
         const res = await axios.post(
            `${
               import.meta.env.VITE_BE_URL
            }/api/v1/${spaceId}/rename-post/${postId}`,
            {
               title,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         console.log(res.data);

         toast.success("Post renamed successfully");
         fetchPosts();
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to rename post");
      }
   };

   const fetchPosts = async () => {
      setLoading(true);

      try {
         const res = await axios.get(
            `${import.meta.env.VITE_BE_URL}/api/v1/${spaceId}/posts`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setPosts(res.data.posts);
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to fetch posts");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchPosts();
   }, [spaceId]);

   if (loading) {
      return (
         <div
            className={`${
               showSidebar ? "hidden w-0 sm:w-full sm:flex" : "w-full"
            } ${
               isDarkMode ? "bg-black text-white" : ""
            } p-3 md:p-10 h-screen flex flex-wrap items-center justify-start gap-4`}
         >
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
      );
   }

   return (
      <div
         className={`${
            showSidebar ? "hidden w-0 sm:w-full sm:block" : "w-full"
         } ${isDarkMode ? "bg-black" : ""} p-3 md:p-10 overflow-y-scroll`}
      >
         {!posts.length ? (
            <div
               className={`h-[86vh] flex items-center justify-center ${
                  isDarkMode ? "text-white" : ""
               }`}
            >
               <h1 className="text-lg">No post in this space.</h1>
            </div>
         ) : (
            <div className="flex items-center justify-start flex-wrap gap-5">
               {posts
                  .sort(
                     (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                  )
                  .map((post) => (
                     <PostCard
                        key={post.id}
                        post={post}
                        shareMode={false}
                        handleDeletePost={handleDeletePost}
                        handleRenamePost={handleRenamePost}
                     />
                  ))}
            </div>
         )}

         <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger asChild>
               <Button
                  variant={"default"}
                  className="fixed bottom-10 right-10"
                  onClick={() => setIsOpen(true)}
               >
                  <PlusCircle />
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
                  <DialogTitle>Add post</DialogTitle>
                  <DialogDescription>Add post in the space</DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="title" className="text-right">
                        Enter title
                     </Label>
                     <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="col-span-3"
                        style={{
                           border: isDarkMode ? "1px solid #272727" : "",
                        }}
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="link" className="text-right">
                        Enter link
                     </Label>
                     <Input
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="col-span-3"
                        style={{
                           border: isDarkMode ? "1px solid #272727" : "",
                        }}
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="contentType" className="text-right">
                        Content Type
                     </Label>
                     <div className="flex items-center gap-3">
                        {contentTypes.current.map((plat) => (
                           <img
                              key={plat}
                              src={`/${plat.toLowerCase()}.svg`}
                              alt={`${plat} icon`}
                              className={`w-5 h-5 cursor-pointer ${
                                 contentType === plat
                                    ? "opacity-100"
                                    : "opacity-50"
                              } hover:opacity-100 object-contain`}
                              style={{
                                 backgroundColor:
                                    isDarkMode && plat === "TWITTER"
                                       ? "white"
                                       : "",
                              }}
                              onClick={() => setContentType(plat)}
                           />
                        ))}
                     </div>
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={handleCreatePost}>Add post</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default SpaceController;
