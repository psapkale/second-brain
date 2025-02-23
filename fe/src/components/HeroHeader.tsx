import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroHeader() {
   const token = useUser().getToken();

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         className="text-center space-y-8"
      >
         <div className="flex items-center justify-center gap-4 mb-6">
            <motion.span
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4, duration: 0.5 }}
               className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-300 text-sm font-medium flex items-center gap-2 border border-pink-500/20"
            >
               <Zap className="w-4 h-4" />
               Powered by Second Brains
            </motion.span>
         </div>

         <div className="container relative z-20 mx-auto px-4 text-center">
            <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight"
            >
               Organize the Internet, One Space at a Time
            </motion.h1>

            <motion.p
               className="text-slate-100 text-sm md:text-lg max-w-2xl mx-auto my-8"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
            >
               Create personalized spaces for your content. Save, organize, and
               share everything from tweets to documents in one beautiful place.
            </motion.p>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
            >
               <Link to={token ? "/spaces" : "/auth"}>
                  <Button
                     size="lg"
                     variant={"outline"}
                     className="text-lg px-8 bg-primary/90 backdrop-blur-sm"
                  >
                     {token ? "Go to Dashboard" : "Get Started"}
                  </Button>
               </Link>
            </motion.div>
         </div>
      </motion.div>
   );
}
