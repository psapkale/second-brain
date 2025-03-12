import { useSidebar } from "@/context/sidebarContext";
import { useTheme } from "@/context/themeContext";

const SelectSpacePlaceholder = () => {
   const { showSidebar } = useSidebar();
   const { theme } = useTheme();
   const isDarkMode = theme === "dark";

   return (
      <div
         className={`${
            showSidebar ? "hidden w-0 sm:w-full sm:flex" : "w-full"
         } flex items-center justify-center gap-3 flex-col`}
         style={{
            backgroundColor: isDarkMode ? "black" : "",
         }}
      >
         <img
            // src="https://i.pinimg.com/736x/ed/7e/64/ed7e641be30d02a53cfc44272b84f5f4.jpg"
            src={
               isDarkMode
                  ? "https://pbs.twimg.com/media/GhapST9aEAAr2Jv?format=jpg&name=large"
                  : "/sleeping-duck.png"
            }
            alt="space-placeholder"
            className="w-[50vw] sm:w-[18vw] h-[42vh] object-contain sm:object-fill"
         />
         <span
            className={`${
               isDarkMode ? "text-slate-200" : "text-slate-800"
            } text-lg`}
         >
            There is no space to work!!
         </span>
      </div>
   );
};

export default SelectSpacePlaceholder;
