import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../../components/Navigation";
import Sidebar from "../../components/Sidebar";
import SelectSpacePlaceholder from "../../components/SelectSpacePlaceholder";

const Layout = () => {
   const location = useLocation();

   return (
      <div className="w-full">
         {/* <Navigation /> */}
         <div className="h-screen flex">
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
