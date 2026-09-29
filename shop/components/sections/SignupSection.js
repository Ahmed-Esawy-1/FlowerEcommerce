import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Rose } from "lucide-react";

const SignupSection = async () => {
    const t = await getTranslations("home.signup");
    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white">
                    <div className="absolute top-0 ltr:right-0 rtl:left-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-center text-gold">
                        <Rose sx={{ fontSize: "20rem" }} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="font-heading text-5xl mb-6">
                            {t("titleLine1")}
                            <br />
                            <span className="text-gold">{t("titleLine2")}</span>
                        </h2>
                        <p className="text-white/80 text-lg mb-10">
                            {t("description")}
                        </p>
                        <Link
                            href="/signup"
                            className="bg-white text-primary font-bold px-10 py-4 rounded-2xl hover:scale-105 hover:bg-marble-light transition-all"
                        >
                            {t("button")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignupSection;
