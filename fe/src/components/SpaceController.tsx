import { useUser } from "@/hooks/useUser";
import { ContentType, PostData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
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
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import PostCard from "./PostCard";

const SpaceController = () => {
   const { spaceId } = useParams();
   const token = useUser().getToken();
   const [posts, setPosts] = useState<PostData[]>([]);
   const [title, setTitle] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const [link, setLink] = useState("");
   const [contentType, setContentType] = useState<ContentType>("TWITTER");
   const [loading, setLoading] = useState(true);

   const validateLink = (link: string, contentType: ContentType) => {
      if (contentType === "TWITTER") {
         return (
            link.startsWith("https://x.com/") ||
            link.startsWith("https://twitter.com/")
         );
      }

      if (contentType === "YOUTUBE") {
         return link.startsWith("https://youtube.com/");
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
      return <div>be hold..</div>;
   }

   return (
      <div className="w-full p-10">
         <div className="flex items-center justify-start flex-wrap gap-5">
            {posts.map((post) => (
               <PostCard key={post.id} post={post} />
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
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <Button
                              variant={"outline"}
                              className="w-full lowercase"
                           >
                              {contentType}
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuItem
                              onClick={() => setContentType("TWITTER")}
                           >
                              Twitter
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => setContentType("YOUTUBE")}
                           >
                              Youtube
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
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
