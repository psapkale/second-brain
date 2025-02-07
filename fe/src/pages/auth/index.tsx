import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { auth, googleProvider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import _ from "lodash";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
   const { setUser } = useUser();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const navigate = useNavigate();

   async function signInWithGoogle() {
      setIsLoading(true);

      try {
         const res = await signInWithPopup(auth, googleProvider);
         const idToken = await res.user.getIdToken();

         const data = await axios.post("http://localhost:8080/api/v1/signin", {
            token: idToken,
         });
         const { message, token, user } = data.data;

         setUser({ ...user, token, createdAt: _.now() });
         toast.success(message);
         navigate("/spaces");
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to signin");
      } finally {
         setIsLoading(false);
      }
   }

   async function loginWithGoogle() {
      setIsLoading(true);

      try {
         const res = await signInWithPopup(auth, googleProvider);
         const idToken = await res.user.getIdToken();

         const data = await axios.post("http://localhost:8080/api/v1/login", {
            token: idToken,
         });
         const { message, token, user } = data.data;

         setUser({ ...user, token, createdAt: _.now() });
         toast.success(message);
         navigate("/spaces");
      } catch (err) {
         console.error(err);

         if (axios.isAxiosError(err)) {
            if (err.response) {
               return toast.error(err.response.data.error.message);
            }
         }
         toast.error("Failed to login");
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 p-4">
         {/* Animated background */}
         <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
         </div>

         {/* Content */}
         <div className="relative w-full max-w-sm mx-auto space-y-8">
            {/* Logo and Title */}
            <div className="flex flex-col items-center space-y-4 text-center">
               <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 blur-2xl opacity-25"></div>
                  <svg
                     className="h-12 w-12 text-white relative z-10"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                     />
                  </svg>
               </div>
               <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                  Welcome
               </h1>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="login" className="w-full">
               <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
                  <TabsTrigger
                     value="login"
                     className="data-[state=active]:bg-white/10 text-white"
                  >
                     Login
                  </TabsTrigger>
                  <TabsTrigger
                     value="signup"
                     className="data-[state=active]:bg-white/10 text-white"
                  >
                     Sign up
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="login" className="space-y-6">
                  <div className="text-center">
                     <p className="text-zinc-400">
                        Sign in to your existing account
                     </p>
                  </div>
                  <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                     <Button
                        className="relative w-full bg-zinc-900 text-white hover:bg-zinc-800 space-x-2 h-12 px-6"
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                     >
                        {!isLoading ? (
                           <>
                              <svg className="h-5 w-5" viewBox="0 0 24 24">
                                 <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                 />
                                 <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                 />
                                 <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                 />
                                 <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                 />
                              </svg>
                              <span>Continue with Google</span>
                           </>
                        ) : (
                           <div className="flex items-center space-x-2">
                              <svg
                                 className="animate-spin h-5 w-5 text-white"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                              >
                                 <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                 ></circle>
                                 <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                 ></path>
                              </svg>
                              <span>Logging in...</span>
                           </div>
                        )}
                     </Button>
                  </div>
               </TabsContent>

               <TabsContent value="signup" className="space-y-6">
                  <div className="text-center">
                     <p className="text-zinc-400">
                        Create a new account to get started
                     </p>
                  </div>
                  <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                     <Button
                        className="relative w-full bg-zinc-900 text-white hover:bg-zinc-800 space-x-2 h-12 px-6"
                        onClick={signInWithGoogle}
                        disabled={isLoading}
                     >
                        {!isLoading ? (
                           <>
                              <svg className="h-5 w-5" viewBox="0 0 24 24">
                                 <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                 />
                                 <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                 />
                                 <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                 />
                                 <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                 />
                              </svg>
                              <span>Sign up with Google</span>
                           </>
                        ) : (
                           <div className="flex items-center space-x-2">
                              <svg
                                 className="animate-spin h-5 w-5 text-white"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                              >
                                 <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                 ></circle>
                                 <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                 ></path>
                              </svg>
                              <span>Creating account...</span>
                           </div>
                        )}
                     </Button>
                  </div>
               </TabsContent>
            </Tabs>

            {/* Terms of Service */}
            <p className="text-center text-sm text-zinc-400">
               By continuing, you agree to our{" "}
               <button
                  onClick={() =>
                     toast("Ohh don't worry, app is not in production yet!!", {
                        icon: "😎",
                     })
                  }
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
               >
                  Terms of Service
               </button>{" "}
               and{" "}
               <button
                  onClick={() =>
                     toast("Ohh don't worry, app is not in production yet!!", {
                        icon: "😎",
                     })
                  }
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
               >
                  Privacy Policy
               </button>
            </p>
         </div>
      </div>
   );
}
