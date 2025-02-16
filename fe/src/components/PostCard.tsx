import { PostData } from "@/types";
import { useEffect, useRef } from "react";

interface PostCardProps {
   post: PostData;
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

const PostCard = ({ post }: PostCardProps) => {
   const isDarkMode = useRef(true);

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

   const renderContent = () => {
      let adjustedLink = post.link;
      if (post.link.includes("x.com")) {
         adjustedLink = post.link.replace("x.com", "twitter.com");
      }

      return (
         <div
            className="mt-4 w-full h-[300px] dark:bg-[#1A1E24] bg-gray-50 overflow-y-scroll custom-scrollbar"
            style={{
               borderRadius: "8px",
               boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
         >
            <blockquote
               className="twitter-tweet w-full"
               data-theme="light"
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

   return (
      <div className="w-[400px]">
         <div className="p-4 h-auto font-poppins dark:bg-[#1A1E24] dark:border-gray-800 border-gray-200 border shadow-md bg-white rounded-lg w-full transition duration-200 hover:scale-[1.05] hover:shadow-lg dark:hover:bg-gray-900 hover:bg-gray-100">
            <div className="flex justify-between">
               <div className="flex items-center">
                  {/* Twitter icon */}
                  <div className="pr-2 ml-3  "></div>
                  <p className="text-lg dark:text-gray-200 text-gray-800">
                     {post.title}
                  </p>
               </div>
            </div>
            {renderContent()}
            <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 flex items-end">
               Added on {new Date().getDate()}
            </div>
         </div>
      </div>
   );
};

export default PostCard;
