"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function page() {
   const [showPassword, setShowPassword] = useState(false);
   return (
      <div className="flex min-h-screen flex-col lg:flex-row">
         {/* <!-- Left Column: Image Section --> */}
         <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center bg-primary/10 overflow-hidden">
            <div className="absolute inset-0 z-0">
               <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover"
                  data-alt="Elegant luxury floral arrangement in a minimalist vase"
                  style={{
                     backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOd7ToUloCiv5nGFHGsRwvAFy2-KPh7GMRb7S9xPTj-1pKRUIL_JIAC7hkL4RMsFkQ0Bsz5FsPeLyKEXfqTkB6sEm-jneBXMH-AtePkm9SE_CZ-02SHbnYNZKS2tE30Fh-5uu1Nm4cmDqdrwYeluh1QAqZsZXq1K_L1y2SF6fd1Za_CjUWGGRpGDB1phpmqiNaZKUGxxTajbzjf5Xhgrx2Kg7VgFxBVZjnnMfTBQwfSlbHE_9j2hE39tREmhq81X96Cwr9ZbSthV6f")`,
                  }}
               ></div>
               <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="relative z-10 px-12 text-center text-white">
               <div className="mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">
                     filter_vintage
                  </span>
               </div>
               <h1 className="text-5xl font-black tracking-tight mb-4">
                  Flow Flower
               </h1>
               <p className="text-xl font-light max-w-md mx-auto opacity-90">
                  Experience the art of premium floral gifting, curated with
                  passion and delivered with grace.
               </p>
            </div>
            {/* <!-- Subtle branding overlay --> */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/70 text-sm">
               <span>© 2026 Flow Flower Studio</span>
               <div className="flex gap-4">
                  <span>Privacy</span>
                  <span>Terms</span>
               </div>
            </div>
         </div>
         {/* <!-- Right Column: Sign Up Form --> */}
         <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-background-light">
            <div className="mx-auto w-full max-w-md">
               {/* <!-- Header Mobile Branding --> */}
               <div className="flex items-center gap-2 mb-12 lg:hidden">
                  <span className="material-symbols-outlined text-primary text-3xl">
                     filter_vintage
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                     Flow Flower
                  </span>
               </div>
               <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                     Join Flow Flower
                  </h2>
                  <p className="mt-3 text-slate-600">
                     Begin your journey into the world of exquisite blooms.
                  </p>
               </div>
               <form action="#" className="space-y-6" method="POST">
                  {/* <!-- Full Name Field --> */}
                  <div>
                     <label
                        className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                        htmlFor="full-name"
                     >
                        Full Name
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                           <span className="material-symbols-outlined text-slate-400 text-xl">
                              person
                           </span>
                        </div>
                        <input
                           autoComplete="name"
                           className="block w-full rounded-xl border-0 outline-none py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                           id="full-name"
                           name="full-name"
                           placeholder="Eleanor Rigby"
                           required=""
                           type="text"
                        />
                     </div>
                  </div>
                  {/* <!-- Email Field --> */}
                  <div>
                     <label
                        className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                        htmlFor="email"
                     >
                        Email Address
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                           <span className="material-symbols-outlined text-slate-400 text-xl">
                              mail
                           </span>
                        </div>
                        <input
                           autoComplete="email"
                           className="block w-full rounded-xl border-0 outline-none py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                           id="email"
                           name="email"
                           placeholder="eleanor@example.com"
                           required=""
                           type="email"
                        />
                     </div>
                  </div>
                  {/* <!-- Password Field --> */}
                  <div>
                     <label
                        className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                        htmlFor="password"
                     >
                        Password
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                           <span className="material-symbols-outlined text-slate-400 text-xl">
                              lock
                           </span>
                        </div>
                        <input
                           autoComplete="new-password"
                           className="block w-full rounded-xl border-0 outline-none py-4 pl-12 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                           id="password"
                           name="password"
                           placeholder="••••••••"
                           required
                           type={showPassword ? "text" : "password"}
                        />
                        {/* Eye button */}
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                           tabIndex={-1}
                        >
                           <span className="material-symbols-outlined">
                              {showPassword ? "visibility_off" : "visibility"}
                           </span>
                        </button>
                     </div>
                     <p className="mt-2 text-xs text-slate-500">
                        Minimum 8 characters with a mix of letters and numbers.
                     </p>
                  </div>
                  {/* Confirm Password */}
                  <div>
                     <label
                        className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                        htmlFor="confirm-password"
                     >
                        Confirm Password
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                           <span className="material-symbols-outlined text-slate-400 text-xl">
                              lock
                           </span>
                        </div>
                        <input
                           autoComplete="new-password"
                           className="block w-full rounded-xl border-0 outline-none py-4 pl-12 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                           id="confirm-password"
                           name="confirm-password"
                           placeholder="••••••••"
                           required
                           type="password"
                        />
                     </div>
                  </div>
                  {/* <!-- Terms Checkbox --> */}
                  <div className="flex items-center">
                     <input
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        id="terms"
                        name="terms"
                        required=""
                        type="checkbox"
                     />
                     <label
                        className="ml-3 block text-sm text-slate-600"
                        htmlFor="terms"
                     >
                        I agree to the{" "}
                        <a
                           className="font-semibold text-primary hover:text-primary/80"
                           href="#"
                        >
                           Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                           className="font-semibold text-primary hover:text-primary/80"
                           href="#"
                        >
                           Privacy Policy
                        </a>
                        .
                     </label>
                  </div>
                  {/* <!-- Submit Button --> */}
                  <div>
                     <button
                        className="flex w-full justify-center rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98]"
                        type="submit"
                     >
                        Create Account
                     </button>
                  </div>
               </form>
               <div className="mt-10 text-center text-sm">
                  <p className="text-slate-600">
                     Already have an account?
                     <Link
                        className="font-bold leading-6 text-primary hover:text-primary/80 transition-colors"
                        href="/login"
                     >
                        Sign In here
                     </Link>
                  </p>
               </div>
               {/* <!-- Social Signup Divider --> */}
               <div className="mt-10">
                  <div className="relative">
                     <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center"
                     >
                        <div className="w-full border-t border-slate-200"></div>
                     </div>
                     <div className="relative flex justify-center text-sm font-medium leading-6">
                        <span className="bg-background-light px-4 text-slate-500">
                           Or join with
                        </span>
                     </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                     <a
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-colors"
                        href="#"
                     >
                        <svg
                           aria-hidden="true"
                           className="h-5 w-5"
                           viewBox="0 0 24 24"
                        >
                           <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.024 1.032-2.324 1.872-4.48 1.872-3.416 0-6.236-2.76-6.236-6.24s2.82-6.24 6.236-6.24c1.88 0 3.32.744 4.332 1.708l2.308-2.308C18.504 3.092 15.908 2 12.48 2 6.48 2 1.6 6.88 1.6 12.88s4.88 10.88 10.88 10.88c3.264 0 5.72-1.072 7.616-3.056 1.952-1.952 2.56-4.688 2.56-6.816 0-.64-.048-1.248-.144-1.84H12.48z"
                              fill="currentColor"
                           ></path>
                        </svg>
                        <span className="text-sm leading-6">Google</span>
                     </a>
                     <a
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-colors"
                        href="#"
                     >
                        <svg
                           className="h-5 w-5 fill-[#1877F2]"
                           viewBox="0 0 24 24"
                        >
                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                        </svg>
                        <span className="text-sm leading-6">Facebook</span>
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
