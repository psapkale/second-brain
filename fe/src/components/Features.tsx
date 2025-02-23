"use client";

import { motion } from "framer-motion";
import { Users, Layout, FileType, Shield } from "lucide-react";

const features = [
   {
      icon: <Layout className="w-6 h-6" />,
      title: "Logical Organization",
      description: "Create structured spaces for different types of content",
      gradient: "from-blue-500 to-purple-500",
   },
   {
      icon: <FileType className="w-6 h-6" />,
      title: "Multiple Formats",
      description: "Support for tweets, videos, documents, images, and more",
      gradient: "from-purple-500 to-pink-500",
   },
   {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboration",
      description: "Work together with your team in shared spaces",
      gradient: "from-pink-500 to-red-500",
   },
   {
      icon: <Shield className="w-6 h-6" />,
      title: "Private & Secure",
      description: "Keep your content safe and private",
      gradient: "from-red-500 to-orange-500",
   },
];

export function Features() {
   return (
      <section className="max-w-7xl mx-auto py-24 relative overflow-hidden">
         <div className="absolute inset-0 modern-gradient opacity-50" />

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
         >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
               Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Powerful features to help you organize and manage your digital
               content
            </p>
         </motion.div>

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
         >
            {features.map((feature, index) => (
               <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10 group"
               >
                  <div
                     className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                     <div className="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center">
                        {feature.icon}
                     </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                     {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
               </motion.div>
            ))}
         </motion.div>
         {/* </div> */}
      </section>
   );
}
