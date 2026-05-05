"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-[calc(100vh-80px-36px)] w-full md:w-[70%] lg:w-1/2 mx-auto flex justify-center items-center m-6 p-6 md:p-12 bg-white rounded-xl">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-text dark:text-text-dark">
            Enter your details to access your floral sanctuary.
          </p>
        </div>
        <form action="/" className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold px-1">Email Address</label>
            <input
              className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="e.g. hello@flowrista.com"
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
                className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text dark:text-text-dark hover:text-[var(--foreground)]"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1">
            <input
              className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
              id="remember"
              type="checkbox"
            />
            <label
              className="text-sm text-text dark:text-text-dark"
              htmlFor="remember"
            >
              Keep me logged in
            </label>
          </div>
          <button
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
            type="submit"
          >
            Sign In
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </form>
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="mt-8">
          <button className="block mx-auto flex items-center justify-center gap-2 py-5 px-10 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <img
              alt="Google"
              className="size-5"
              data-alt="Google colorful brand logo icon"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4OIVZmdLc3834blOFW1EPbzjJJ7RGZCpDqb9MmfYSmuEBGCCv8_7UPfwKqNSM2-62COUGXhJ4vyPPpXWpYpwJSeZAJa6yu5_YOMXLV9L9CeRM_dyT7p-E8VIfk6ZQFB3KcIrkFtIKwBU0ddTa_Hy8qRRIwsZOFFRoHRpIzbO9foWl4XNNOmwzKMdkPc-BNjHe-JnstQ_cZW0_T0Nb3PURLIkve3HLWLPU97EnjqsmNWlvkPgpYwi7L2DU8YB9fIAZikTHVbsmG3Fq"
            />
            <span className="text-sm font-bold">Google</span>
          </button>
        </div>
        <p className="mt-12 text-center text-text dark:text-text-dark">
          Don't have an account?
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
