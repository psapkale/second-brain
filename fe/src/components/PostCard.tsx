import { PostData } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Check, Ellipsis, Pencil, Trash } from "lucide-react";
import { useTheme } from "@/context/themeContext";
import { Input } from "./ui/input";
import { format } from "date-fns";

interface PostCardProps {
   post: PostData;
   shareMode: boolean;
   handleDeletePost?: (post: PostData) => void;
   handleRenamePost?: (postId: string, title: string) => void;
}

declare global {
   interface Window {
      instgrm?: {
         Embeds: {
            process: () => void;
         };
      };
      twttr?: {
         widgets: {
            load: () => void;
         };
      };
   }
}

const PostCard = ({
   post,
   shareMode,
   handleDeletePost,
   handleRenamePost,
}: PostCardProps) => {
   const { theme } = useTheme();
   const isDarkMode = theme === "dark";
   const inputRef = useRef<HTMLInputElement>(null);
   const [isRenaming, setIsRenaming] = useState(false);

   const handleRename = () => {
      if (inputRef.current && !shareMode && handleRenamePost) {
         handleRenamePost(post.id, inputRef.current.value);
         setIsRenaming(false);
      }
   };

   useEffect(() => {
      const addTwitterTheme = () => {
         const twttrScriptElem = document.querySelector(
            'script[src="https://platform.twitter.com/widgets.js"]'
         );

         if (twttrScriptElem) {
            window.twttr?.widgets.load();
            const twttrEmbeds = document.querySelectorAll(".twitter-tweet");
            twttrEmbeds.forEach((embed) => {
               embed.setAttribute("data-theme", isDarkMode ? "dark" : "light");
            });
         }
      };

      if (post.link.includes("twitter.com") || post.link.includes("x.com")) {
         const script = document.createElement("script");
         script.src = "https://platform.twitter.com/widgets.js";
         script.async = true;
         document.body.appendChild(script);

         script.onload = addTwitterTheme;

         const observer = new MutationObserver((mutations) => {
            mutations.forEach((muts) => {
               if (
                  muts.type === "attributes" &&
                  muts.attributeName === "class"
               ) {
                  addTwitterTheme();
               }
            });
         });

         observer.observe(document.documentElement, { attributes: true });

         return () => {
            document.body.removeChild(script);
            observer.disconnect();
         };
      }
   }, [post]);

   useEffect(() => {
      const addInstagramTheme = () => {
         const instaEmbeds = document.querySelectorAll(".instagram-media");
         instaEmbeds.forEach((embed) => {
            embed.classList.toggle("data-theme", isDarkMode);
         });
      };

      if (post.link.includes("instagram.com")) {
         const script = document.createElement("script");
         script.src = "https://www.instagram.com/embed.js";
         script.async = true;
         document.body.appendChild(script);

         script.onload = () => {
            window.instgrm?.Embeds.process();
            addInstagramTheme();
         };

         const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
               if (
                  mutation.type === "attributes" &&
                  mutation.attributeName === "class"
               ) {
                  addInstagramTheme();
               }
            });
         });

         observer.observe(document.documentElement, { attributes: true });

         return () => {
            document.body.removeChild(script);
            observer.disconnect();
         };
      }
   }, [post]);

   const loadTwittrContent = () => {
      let adjustedLink = post.link;
      if (post.link.includes("x.com")) {
         adjustedLink = post.link.replace("x.com", "twitter.com");
      }

      return (
         <div
            className="mt-4 w-full h-[300px] overflow-y-scroll custom-scrollbar"
            style={{
               borderRadius: "8px",
               boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
         >
            <blockquote
               className="twitter-tweet w-full"
               data-theme={theme}
               style={{
                  maxWidth: "100%",
                  boxSizing: "border-box",
               }}
            >
               <a href={adjustedLink}></a>
            </blockquote>
         </div>
      );
   };

   const loadYoutbeContent = () => {
      const videoId = post.link.includes("youtube.com")
         ? new URL(post.link).searchParams.get("v")
         : post.link.split("/").pop();

      return (
         videoId && (
            <iframe
               className="w-full mt-5 h-[300px] rounded-lg shadow-md dark:border dark:border-gray-800"
               src={`https://www.youtube.com/embed/${videoId}`}
               frameBorder={0}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
            ></iframe>
         )
      );
   };

   const loadInstagrmContent = () => {
      return (
         post.link.includes("instagram.com") && (
            <div
               className="mt-4 w-full h-[300px] dark:bg-[#1A1E24] bg-gray-50 overflow-y-scroll custom-scrollbar"
               style={{
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
               }}
            >
               <blockquote
                  className="instagram-media w-full"
                  data-instgrm-permalink={post.link}
                  data-instgrm-version="15"
                  style={{
                     maxWidth: "100%",
                     boxSizing: "border-box",
                  }}
               ></blockquote>
            </div>
         )
      );
   };

   const renderIcon = () => {
      const icon = {
         src: "",
         alt: "",
      };

      if (post.contentType === "TWITTER") {
         icon.src = "/twitter.svg";
         icon.alt = "Twitter icon";
      } else if (post.contentType === "YOUTUBE") {
         icon.src = "/youtube.svg";
         icon.alt = "Youtube icon";
      } else if (post.contentType === "INSTAGRAM") {
         icon.src = "/instagram.svg";
         icon.alt = "Instagram icon";
      }

      return <img src={icon.src} alt={icon.alt} className="w-4 h-4" />;
   };

   const renderContent = () => {
      if (post.contentType === "TWITTER") {
         return loadTwittrContent();
      }

      if (post.contentType === "YOUTUBE") {
         return loadYoutbeContent();
      }

      if (post.contentType === "INSTAGRAM") {
         return loadInstagrmContent();
      }

      return <div></div>;
   };

   return (
      <div
         style={{
            width: post.contentType === "YOUTUBE" ? 600 : 400,
         }}
      >
         <div
            className={`${
               isDarkMode
                  ? "bg-[#0e1114] text-gray-200 border-gray-800 hover:bg-gray-900"
                  : "bg-white text-gray-800"
            } p-4 h-auto font-poppins border-gray-200 border shadow-md rounded-lg w-full transition duration-200 hover:scale-[1.01] hover:shadow-lg hover:bg-gray-100`}
         >
            <div className="flex justify-between">
               <div className="w-full mx-3 flex items-center justify-between">
                  <div className="flex items-center">
                     <div className="pr-2">{renderIcon()}</div>
                     {isRenaming && !shareMode ? (
                        <Input
                           type="text"
                           ref={inputRef}
                           placeholder={post.title}
                           className={`border ${
                              isDarkMode ? "border-gray-800" : "border-gray-200"
                           }`}
                        />
                     ) : (
                        <p className="text-[1rem] capitalize">{post.title}</p>
                     )}
                  </div>
                  <span className="self-end">
                     {!shareMode &&
                        (isRenaming ? (
                           <Check
                              className="w-5 h-5 cursor-pointer"
                              onClick={handleRename}
                           />
                        ) : (
                           <DropdownMenu>
                              <DropdownMenuTrigger>
                                 <Ellipsis className="w-4 h-4" />
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
                                    onClick={() => setIsRenaming(!isRenaming)}
                                 >
                                    <Pencil className="w-3 h-3" />
                                    <span>Rename</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                       handleDeletePost &&
                                       handleDeletePost(post)
                                    }
                                 >
                                    <Trash className="w-3 h-3 text-red-500" />
                                    <span>Delete</span>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        ))}
                  </span>
               </div>
            </div>
            {renderContent()}
            <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 flex items-end">
               Added on{" "}
               {format(new Date(post.createdAt), "dd-MMM-yy h:mm a")
                  .split("-")
                  .join(" ")}
            </div>
         </div>
      </div>
   );
};

export default PostCard;
