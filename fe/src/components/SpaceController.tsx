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
import PostCard from "./PostCard";

const SpaceController = () => {
   const { spaceId } = useParams();
   const token = useUser().getToken();
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
         return (
            link.startsWith("https://x.com/") ||
            link.startsWith("https://www.x.com/") ||
            link.startsWith("https://twitter.com/") ||
            link.startsWith("https://www.twitter.com/")
         );
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
            return toast.error(`Link not a ${contentType.toLowerCase()} link`);
         }

         const res = await axios.post(
            `http://localhost:8080/api/v1/${spaceId}/create-post`,
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
            `http://localhost:8080/api/v1/${spaceId}/delete-post/${post.id}`,
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

   const fetchPosts = async () => {
      setLoading(true);

      try {
         const res = await axios.get(
            `http://localhost:8080/api/v1/${spaceId}/posts`,
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
      return <div className="w-full">be hold..</div>;
   }

   return (
      <div className="w-full p-10 overflow-y-scroll">
         <div className="flex items-center justify-start flex-wrap gap-5">
            {posts.map((post) => (
               <PostCard
                  key={post.id}
                  post={post}
                  handleDeletePost={handleDeletePost}
               />
            ))}
         </div>

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
            <DialogContent className="sm:max-w-[425px]">
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
