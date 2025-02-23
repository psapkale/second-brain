import { BackgroundEffects } from "./BackgroundEffects";
import { HeroHeader } from "./HeroHeader";
import { Features } from "./Features";
import { motion } from "framer-motion";
import { ScrollIndicator } from "./ScrollIndicator";
import { HowItWorks } from "./HowItWorks";
import { Appbar } from "./Appbar";
import Footer from "./Footer";

export function Hero() {
   return (
      <div className="bg-black">
         <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black text-white overflow-hidden">
            <Appbar />
            <BackgroundEffects />

            <div className="relative pt-20 mt-10">
               <HeroHeader />

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="my-20 space-y-20"
               >
                  <HowItWorks />

                  <section id="features" className="relative">
                     <Features />
                  </section>
               </motion.div>

               <Footer />
            </div>

            <ScrollIndicator />
         </div>
      </div>
   );
}
