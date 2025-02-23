"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
   return (
      <footer className="bg-black px-10 border-t">
         <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
               >
                  <h3 className="text-2xl font-bold mb-4">Join the Waitlist</h3>
                  <p className="text-muted-foreground mb-4">
                     Be the first to know when we launch
                  </p>
                  <div className="flex gap-2">
                     <Input
                        type="email"
                        placeholder="Enter your email"
                        className="max-w-xs"
                     />
                     <Button>Subscribe</Button>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="md:text-right"
               >
                  <div className="flex gap-4 md:justify-end mb-4">
                     <Link to={"https://x.com/premstw"} target="_blank">
                        <Button
                           variant="ghost"
                           size="icon"
                           className="cursor-pointer"
                        >
                           <Twitter className="w-5 h-5" />
                        </Button>
                     </Link>
                     <Link to={"http://github.com/psapkale"} target="_blank">
                        <Button
                           variant="ghost"
                           size="icon"
                           className="cursor-pointer"
                        >
                           <Github className="w-5 h-5" />
                        </Button>
                     </Link>
                     <Link
                        to={"https://www.linkedin.com/in/premsapkale"}
                        target="_blank"
                     >
                        <Button
                           variant="ghost"
                           size="icon"
                           className="cursor-pointer"
                        >
                           <Linkedin className="w-5 h-5" />
                        </Button>
                     </Link>
                  </div>
                  <p className="text-sm text-muted-foreground">
                     © 2025 Project Space. All rights reserved.
                  </p>
               </motion.div>
            </div>
         </div>
      </footer>
   );
}
