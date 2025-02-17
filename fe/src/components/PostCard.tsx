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

   const loadTwittrContent = () => {
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
               data-theme={isDarkMode ? "dark" : "light"}
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

      return <div></div>;
   };

   return (
      <div style={{ width: post.contentType === "YOUTUBE" ? 600 : 400 }}>
         <div className="p-4 h-auto font-poppins dark:bg-[#1A1E24] dark:border-gray-800 border-gray-200 border shadow-md bg-white rounded-lg w-full transition duration-200 hover:scale-[1.01] hover:shadow-lg dark:hover:bg-gray-900 hover:bg-gray-100">
            <div className="flex justify-between">
               <div className="flex items-center">
                  <div className="pr-2 ml-3">{renderIcon()}</div>
                  <p className="text-[1rem] dark:text-gray-200 text-gray-800 capitalize">
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
