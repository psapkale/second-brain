"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SunSnow, Binoculars, Sailboat } from "lucide-react";

const steps = [
   {
      icon: <Binoculars className="w-6 h-6" />,
      title: "Discover Content",
      description: "Find and collect content from anywhere on the internet",
   },
   {
      icon: <SunSnow className="w-6 h-6" />,
      title: "Create Spaces",
      description: "Organize the content into meaningful collections",
   },
   {
      icon: <Sailboat className="w-6 h-6" />,
      title: "Share with your friends",
      description: "Work together and share your organized spaces",
   },
];

export function HowItWorks() {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true });

   return (
      <motion.div
         ref={ref}
         initial={{ opacity: 0, y: 20 }}
         animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
         transition={{ duration: 0.8 }}
         className="space-y-12 max-w-7xl mx-auto"
      >
         <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
               How It{" "}
               <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Works
               </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
               Transform your feed with your fingertips
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
               <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                     isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="relative group"
               >
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />
                  <div className="relative space-y-4 text-center p-6 rounded-xl bg-white/5 border border-white/10">
                     <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        {step.icon}
                     </div>
                     <h3 className="text-xl font-semibold">{step.title}</h3>
                     <p className="text-gray-400">{step.description}</p>
                  </div>
               </motion.div>
            ))}
         </div>
      </motion.div>
   );
}
