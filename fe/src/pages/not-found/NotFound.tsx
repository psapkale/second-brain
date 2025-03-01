import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/themeContext";
import { MoveLeft, MapPin, Sun, Moon, Space } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
   const { theme, setTheme } = useTheme();
   const isDarkMode = theme === "dark";

   return (
      <div
         className={`${
            isDarkMode ? "bg-black text-white" : ""
         } py-10 flex flex-col items-center justify-center min-h-screen px-4 text-center`}
      >
         <Link
            to={"/spaces"}
            className="w-full md:px-10 text-5xl font-semibold flex gap-2 items-end mb-10"
         >
            <Space />
            <span>Project </span>
            <span>Space</span>
         </Link>

         <div className="space-y-8">
            <div className="relative mx-auto w-80 h-[50vh]">
               <img
                  src="/not-found.png"
                  alt="A person looking at a map, appearing lost"
                  className={`w-full h-full ${
                     isDarkMode ? "" : "border"
                  } rounded-lg`}
               />
               <div className="absolute -bottom-[10px] right-0 text-primary-foreground p-3 rounded-full animate-bounce">
                  <MapPin className="h-6 w-6 text-black" />
               </div>
            </div>

            <div className="w-fit space-y-4">
               <h1
                  className={`w-fit pb-3 text-4xl font-extrabold lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r ${
                     isDarkMode
                        ? "from-slate-200 to-slate-950"
                        : "from-slate-950 to-slate-300"
                  } text-nowrap`}
               >
                  Looks like you're lost!
               </h1>
               <p className="text-muted-foreground text-lg">
                  The page you're looking for has wandered off the map.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                     asChild
                     size="lg"
                     variant={isDarkMode ? "default" : "outline"}
                     className="gap-2"
                  >
                     <Link to="/spaces">
                        <MoveLeft className="h-4 w-4" />
                        Find your way home
                     </Link>
                  </Button>

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
               </div>
            </div>
         </div>
      </div>
   );
};

export default NotFound;
