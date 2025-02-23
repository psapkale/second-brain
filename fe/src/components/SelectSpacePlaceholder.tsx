import { useTheme } from "@/context/themeContext";

const SelectSpacePlaceholder = () => {
   const { theme } = useTheme();
   const isDarkMode = theme === "dark";

   return (
      <div
         className="w-full flex items-center justify-center gap-3 flex-col"
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
            className="w-[20vw] h-[42vh]"
         />
         <span
            className={`${
               isDarkMode ? "text-slate-200" : "text-slate-800"
            } text-lg`}
         >
            There is no space to work!!
         </span>
         <div
            className={`${
               isDarkMode ? "text-slate-300" : "text-slate-700"
            } text-xs flex items-center gap-1`}
         >
            <img
               src={isDarkMode ? "/arrow-dark.png" : "/arrow-light.png"}
               alt="left arrow"
               className={`w-16 h-16 ${
                  isDarkMode ? "rotate-[140deg]" : "scale-y-[-1] rotate-45"
               }`}
            />
            <span>select from there</span>
         </div>
      </div>
   );
};

export default SelectSpacePlaceholder;
