"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRegisterMutation, useLoginMutation } from "@/lib/api/homeApi";

import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

const emptyErrors = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
};

export default function page() {
    const t = useTranslations("auth.signup");
    const router = useRouter();

    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [login, { isLoading: isLoggingIn }] = useLoginMutation();

    const isLoading = isRegistering || isLoggingIn;

    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [error, setError] = useState(emptyErrors);

    const [showPassword, setShowPassword] = useState(false);

    const isFormComplete =
        form.userName.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.confirmPassword.trim() &&
        form.terms;

    // ---- INPUT CHANGE ----------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        setError((prev) => ({ ...prev, [name]: "" }));
    };

    // ---- VALIDATION --------------------------------------------------------------------------
    const validate = () => {
        const nextErrors = { ...emptyErrors };

        if (!form.userName.trim()) {
            nextErrors.userName = t("userNameRequired");
        }

        if (!EMAIL_REGEX.test(form.email.trim())) {
            nextErrors.email = t("emailInvalid");
        }

        if (form.password.length < 8) {
            nextErrors.password = t("passwordTooShort");
        } else if (!PASSWORD_REGEX.test(form.password)) {
            nextErrors.password = t("passwordPattern");
        }

        if (form.password && form.confirmPassword !== form.password) {
            nextErrors.confirmPassword = t("passwordMismatch");
        }

        setError(nextErrors);

        return !Object.values(nextErrors).some(Boolean);
    };

    // ---- SUBMIT ------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register({
                userName: form.userName.trim(),
                email: form.email.trim(),
                password: form.password,
            }).unwrap();

            router.push("/");
        } catch (err) {
            if (err?.status === 409) {
                setError((prev) => ({
                    ...prev,
                    general: t("emailAlreadyExists"),
                }));
            } else {
                setError((prev) => ({ ...prev, general: t("genericError") }));
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* IMAGE SECTION  */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center bg-primary/10 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        className="w-full h-full bg-cover"
                        alt="Elegant luxury floral arrangement in a minimalist vase"
                        src="/images/signup_background.png"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="relative z-10 px-12 text-center text-white">
                    <div className="mb-6 flex justify-center">
                        <FilterVintageIcon sx={{ fontSize: 60 }} />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4">
                        {t("brandTitle")}
                    </h1>
                    <p className="text-xl font-light max-w-md mx-auto opacity-90">
                        {t("brandTagline")}
                    </p>
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/70 text-sm">
                    <span>{t("copyright")}</span>
                    <div className="flex gap-4">
                        <span>{t("privacy")}</span>
                        <span>{t("terms")}</span>
                    </div>
                </div>
            </div>

            {/* FORM*/}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-background-light">
                <div className="mx-auto w-full max-w-md">
                    {/* HEADER */}
                    <div className="flex items-center gap-2 mb-12 lg:hidden">
                        <FilterVintageIcon
                            className="text-primary"
                            sx={{ fontSize: 30 }}
                        />
                        <span className="text-2xl font-bold tracking-tight">
                            {t("brandTitle")}
                        </span>
                    </div>
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            {t("title")}
                        </h2>
                        <p className="mt-3 text-slate-600">{t("subtitle")}</p>
                    </div>

                    {/* GENERAL ERROR */}
                    {error.general && (
                        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-inset ring-red-200">
                            {error.general}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        noValidate
                    >
                        {/* USERNAME */}
                        <div>
                            <label
                                className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                                htmlFor="userName"
                            >
                                {t("fullNameLabel")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-4 rtl:pr-4 pointer-events-none">
                                    <PersonIcon
                                        className="text-slate-400"
                                        fontSize="small"
                                    />
                                </div>
                                <input
                                    autoComplete="name"
                                    className={`block w-full rounded-xl border-0 outline-none py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-slate-900 shadow-sm ring-1 ring-inset bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                                        error.userName
                                            ? "ring-red-300 focus:ring-red-500"
                                            : "ring-slate-200 focus:ring-primary"
                                    }`}
                                    id="userName"
                                    name="userName"
                                    placeholder={t("fullNamePlaceholder")}
                                    type="text"
                                    value={form.userName}
                                    onChange={handleChange}
                                />
                            </div>
                            {error?.userName && (
                                <div className="mt-2 text-sm text-red-600">
                                    {error.userName}
                                </div>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label
                                className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                                htmlFor="email"
                            >
                                {t("emailLabel")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-4 rtl:pr-4 pointer-events-none">
                                    <MailIcon
                                        className="text-slate-400"
                                        fontSize="small"
                                    />
                                </div>
                                <input
                                    autoComplete="email"
                                    className={`block w-full rounded-xl border-0 outline-none py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-slate-900 shadow-sm ring-1 ring-inset bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                                        error.email
                                            ? "ring-red-300 focus:ring-red-500"
                                            : "ring-slate-200 focus:ring-primary"
                                    }`}
                                    id="email"
                                    name="email"
                                    placeholder={t("emailPlaceholder")}
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {error?.email && (
                                <div className="mt-2 text-sm text-red-600">
                                    {error.email}
                                </div>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label
                                className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                                htmlFor="password"
                            >
                                {t("passwordLabel")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-4 rtl:pr-4 pointer-events-none">
                                    <LockIcon
                                        className="text-slate-400"
                                        fontSize="small"
                                    />
                                </div>
                                <input
                                    autoComplete="new-password"
                                    className={`block w-full rounded-xl border-0 outline-none py-4 px-12 text-slate-900 shadow-sm ring-1 ring-inset bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                                        error.password
                                            ? "ring-red-300 focus:ring-red-500"
                                            : "ring-slate-200 focus:ring-primary"
                                    }`}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 ltr:right-0 rtl:left-0  flex items-center ltr:pr-4 rtl:pl-4 text-slate-400 hover:text-slate-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <VisibilityOffIcon fontSize="small" />
                                    ) : (
                                        <VisibilityIcon fontSize="small" />
                                    )}
                                </button>
                            </div>
                            {error?.password ? (
                                <div className="mt-2 text-sm text-red-600">
                                    {error.password}
                                </div>
                            ) : (
                                <p className="mt-2 text-xs text-slate-500">
                                    {t("passwordHint")}
                                </p>
                            )}
                        </div>
                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label
                                className="block text-sm font-semibold leading-6 text-slate-900 mb-2"
                                htmlFor="confirmPassword"
                            >
                                {t("confirmPasswordLabel")}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-4 rtl:pr-4 pointer-events-none">
                                    <LockIcon
                                        className="text-slate-400"
                                        fontSize="small"
                                    />
                                </div>
                                <input
                                    autoComplete="new-password"
                                    className={`block w-full rounded-xl border-0 outline-none py-4 px-12 text-slate-900 shadow-sm ring-1 ring-inset bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                                        error.confirmPassword
                                            ? "ring-red-300 focus:ring-red-500"
                                            : "ring-slate-200 focus:ring-primary"
                                    }`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            {error?.confirmPassword && (
                                <div className="mt-2 text-sm text-red-600">
                                    {error.confirmPassword}
                                </div>
                            )}
                        </div>

                        {/* TERMS CHECKBOX */}
                        <div className="flex items-center">
                            <input
                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={form.terms}
                                onChange={(e) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        terms: e.target.checked,
                                    }));
                                }}
                            />
                            <label
                                className="ltr:ml-3 rtl:mr-3 block text-sm text-slate-600"
                                htmlFor="terms"
                            >
                                {t("agreeTerms")}{" "}
                                <span className="font-semibold text-primary hover:text-primary/80">
                                    {t("termsOfService")}
                                </span>{" "}
                                {t("and")}{" "}
                                <span className="font-semibold text-primary hover:text-primary/80">
                                    {t("privacyPolicy")}
                                </span>
                                .
                            </label>
                        </div>

                        {/* SUBMIT */}
                        <div>
                            <button
                                className="flex w-full justify-center rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98] disabled:opacity-60"
                                type="submit"
                                disabled={!isFormComplete || isLoading}
                            >
                                {isLoading
                                    ? t("creatingAccount")
                                    : t("createAccount")}
                            </button>
                        </div>
                    </form>
                    <div className="mt-10 text-center text-sm">
                        <p className="text-slate-600">
                            {t("alreadyHaveAccount")}{" "}
                            <Link
                                className="font-bold leading-6 text-primary hover:text-primary/80 transition-colors"
                                href="/login"
                            >
                                {t("signInHere")}
                            </Link>
                        </p>
                    </div>
                    {/* CONTINUE WITH */}
                    <div className="mt-4">
                        <div className="relative mb-2">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 flex items-center"
                            >
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm font-medium leading-6">
                                <span className="bg-background-light px-4 text-slate-500">
                                    {t("orJoinWith")}
                                </span>
                            </div>
                        </div>
                        <button className="block bg-white mx-auto flex items-center justify-center gap-2 py-5 px-10 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <GoogleIcon className="text-primary" />
                            <span className="text-sm font-bold">
                                {t("google")}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
