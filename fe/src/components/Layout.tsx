import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import SelectSpacePlaceholder from "./SelectSpacePlaceholder";

const Layout = () => {
   const location = useLocation();

   return (
      <div className="w-full">
         {/* <Navigation /> */}
         <div className="h-screen flex gap-2">
            <Sidebar />
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
