import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
   return (
      <div>
         <nav className="flex items-center justify-end py-1 px-2">
            <Link to={"/login"}>
               <Button>Login</Button>
            </Link>
         </nav>
         LandingPage
      </div>
   );
};

export default LandingPage;
