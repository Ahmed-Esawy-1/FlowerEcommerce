"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useGetMeQuery, useLoginMutation } from "@/lib/api/authApi";

import { ArrowUp, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const t = useTranslations("auth.login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { data } = useGetMeQuery();
    const [login, { isLoading }] = useLoginMutation();

    // ---- REDIRECT TO HOME (If aleardy loginned) -------------------------------------
    useEffect(() => {
        console.log(data?.user);
        if (data?.user) {
            router.replace("/");
        }
    }, [data, router]);

    // ---- SUBMIT ---------------------------------------------------------------
    async function handleFormSubmit(e) {
        e.preventDefault();

        try {
            await login({ email, password }).unwrap();
            router.push("/");
        } catch (error) {
            console.log(error?.data);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center p-4">
            <div className="aspect[6/8] w-full md:w-[70%] max-w-142 mx-auto m-6 p-6 md:p-12 bg-white rounded-xl">
                {/* HEADER */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black tracking-tight mb-2">
                        {t("title")}
                    </h2>
                    <p className="text-text">{t("subtitle")}</p>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* EMAIL */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold px-1">
                            {t("emailLabel")}
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                            placeholder={t("emailPlaceholder")}
                            type="email"
                        />
                    </div>
                    {/* PASSWORD */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-semibold">
                                {t("passwordLabel")}
                            </label>
                            <a
                                className="text-xs font-bold text-primary hover:underline"
                                href="#"
                            >
                                {t("forgotPassword")}
                            </a>
                        </div>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("passwordPlaceholder")}
                                className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                            />
                            <button
                                className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-text hover:text-[var(--foreground)]"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>
                    {/* SIGN IN */}
                    <button
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        type="submit"
                    >
                        {isLoading ? (
                            t("signingIn")
                        ) : (
                            <>
                                <span>{t("signIn")}</span>
                                <ArrowUp className="!text-xl group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                            </>
                        )}
                    </button>
                </form>
                {/* CONTINUE WITH */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                        {t("orContinueWith")}
                    </span>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                <div className="mt-8">
                    <button className="block mx-auto flex items-center justify-center gap-2 py-5 px-10 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        {/* <Google className="text-primary" /> */}
                        <span className="text-sm font-bold">{t("google")}</span>
                    </button>
                </div>
                <p className="mt-12 text-center text-text">
                    {t("noAccount")}{" "}
                    <Link
                        className="text-primary font-bold hover:underline"
                        href="/signup"
                    >
                        {t("createAccount")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
