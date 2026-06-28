"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetMeQuery, useLoginMutation } from "../../../../lib/api/homeApi";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
   const router = useRouter();

   const [showPassword, setShowPassword] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const { data } = useGetMeQuery();
   const [login, { isLoading }] = useLoginMutation();

   useEffect(() => {
      if (data?.user) {
         router.replace("/");
      }
   }, [data, router]);

   async function handleFormSubmit(e) {
      e.preventDefault();
      console.log("submit");

      try {
         const response = await login({
            email,
            password,
         }).unwrap();

         console.log(response);
         router.push("/");
      } catch (error) {
         console.log(error?.data);
      }
   }

   return (
      <div className="min-h-screen flex justify-center items-center p-4">
         <div className="aspect[6/8] w-full md:w-[70%] max-w-142 mx-auto m-6 p-6 md:p-12 bg-white rounded-xl">
            <div className="mb-10 text-center">
               <h2 className="text-3xl font-black tracking-tight mb-2">
                  Welcome Back
               </h2>
               <p className="text-text ">
                  Enter your details to access your floral sanctuary.
               </p>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
               <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold px-1">
                     Email Address
                  </label>
                  <input
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full px-4 py-4 rounded-xl border border-slate-200  bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400 "
                     placeholder="e.g. example@gmail.com"
                     type="email"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-sm font-semibold">Password</label>
                     <a
                        className="text-xs font-bold text-primary hover:underline"
                        href="#"
                     >
                        Forgot password?
                     </a>
                  </div>
                  <div className="relative flex items-center">
                     <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400 "
                     />
                     <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text  hover:text-[var(--foreground)]"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                     >
                        {showPassword ? (
                           <VisibilityOffIcon />
                        ) : (
                           <VisibilityIcon />
                        )}
                     </button>
                  </div>
               </div>
               <button
                  disabled={isLoading}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  type="submit"
               >
                  {isLoading ? (
                     "Signing In..."
                  ) : (
                     <>
                        <span>"Sign In"</span>
                        <ArrowForwardIcon className="!text-xl group-hover:translate-x-1 transition-transform" />
                     </>
                  )}
               </button>
            </form>
            <div className="mt-8 flex items-center gap-4">
               <div className="h-px flex-1 bg-slate-200 "></div>
               <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  Or continue with
               </span>
               <div className="h-px flex-1 bg-slate-200 "></div>
            </div>
            <div className="mt-8">
               <button className="block mx-auto flex items-center justify-center gap-2 py-5 px-10 border border-slate-200  rounded-xl hover:bg-slate-50 transition-colors">
                  <GoogleIcon className="text-primary" />
                  <span className="text-sm font-bold">Google</span>
               </button>
            </div>
            <p className="mt-12 text-center text-text">
               Don't have an account?{" "}
               <Link
                  className="text-primary font-bold hover:underline"
                  href="/signup"
               >
                  Create an account
               </Link>
            </p>
         </div>
      </div>
   );
}
