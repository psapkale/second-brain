import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import SelectSpacePlaceholder from "../../components/SelectSpacePlaceholder";
import { useState } from "react";
import { SidebarClose } from "lucide-react";
import { useTheme } from "@/context/themeContext";

const Layout = () => {
   const location = useLocation();
   const [showSidebar, setShowSidebar] = useState(true);
   const { theme } = useTheme();
   const isDarkMode = theme === "dark";

   return (
      <div className="w-full">
         <SidebarClose
            className={`absolute bottom-2 left-2 w-7 h-7 ${
               isDarkMode ? "text-slate-100" : "text-black"
            } cursor-pointer z-10`}
            onClick={() => setShowSidebar(!showSidebar)}
         />

         <div className="h-screen flex">
            <Sidebar showSidebar={showSidebar} />
            {location.pathname.endsWith("spaces") ||
            location.pathname.endsWith("spaces/") ? (
               <SelectSpacePlaceholder />
            ) : (
               <Outlet />
            )}
         </div>
      </div>
   );
};

export default Layout;
