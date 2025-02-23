import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { motion } from "framer-motion";
import { Space } from "lucide-react";
import { Link } from "react-router-dom";

export function Appbar() {
   const token = useUser().getToken();

   return (
      <div className="bg-black">
         <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 z-50 w-full p-2"
         >
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
               className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 backdrop-blur-xl rounded-2xl bg-background/50 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
               <div className="flex h-16 items-center justify-between">
                  {/* Logo */}
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Link
                        to="/"
                        className="flex items-center space-x-2 transition-opacity hover:opacity-90"
                     >
                        <Space />
                        <span className="hidden font-bold font-mono text-xl sm:inline-block">
                           ProjectSpace
                        </span>
                     </Link>
                  </motion.div>

                  <div className="flex items-center gap-4">
                     <Link to={token ? "/spaces" : "/auth"}>
                        <Button variant={"ghost"} className="bg-transparent">
                           {token ? "Dashboard" : "Login"}
                        </Button>
                     </Link>
                  </div>
               </div>
            </motion.div>
         </motion.header>
      </div>
   );
}
