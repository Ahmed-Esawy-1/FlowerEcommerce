import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

const sparklePositions = [
    { top: "8%", left: "12%", size: 4, delay: "0s" },
    { top: "18%", left: "85%", size: 3, delay: "0.6s" },
    { top: "72%", left: "8%", size: 5, delay: "1.2s" },
    { top: "80%", left: "90%", size: 3, delay: "1.8s" },
    { top: "45%", left: "5%", size: 3, delay: "0.9s" },
    { top: "40%", left: "95%", size: 4, delay: "2.1s" },
];

const Hero = async () => {
    const t = await getTranslations("home.hero");

    return (
        <section className="hero-marble-bg relative min-h-[85vh] overflow-hidden flex items-center">
            {/* thin gold hairline border, top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
                {/* TEXT SIDE */}
                <div className="flex flex-col items-start order-2 lg:order-1">
                    <span className="font-body text-primary text-[11px] font-semibold tracking-[0.35em] uppercase mb-6">
                        {t("badge")}
                    </span>

                    <h1 className="font-heading text-5xl md:text-7xl text-slate-900 leading-[1.1] mb-6">
                        {t("titleLine1")}
                        <br />
                        <span className="font-accent italic text-primary">
                            {t("titleLine2")}
                        </span>
                    </h1>

                    <p className="font-body text-base text-text mb-10 max-w-md leading-relaxed">
                        {t("description")}
                    </p>

                    <div className="flex gap-4">
                        <Link
                            href="/products"
                            className="luxury-button bg-primary text-white hover:bg-slate-900 shadow-lg"
                        >
                            {t("shopNow")}
                        </Link>
                        <Link
                            href="/products"
                            className="luxury-button border border-primary/30 text-primary hover:bg-primary/5"
                        >
                            {t("viewCatalog")}
                        </Link>
                    </div>
                </div>

                {/* LOGO SIGNATURE SIDE */}
                <div className="relative flex items-center justify-center order-1 lg:order-2">
                    {/* sparkles */}
                    {sparklePositions.map((s, i) => (
                        <span
                            key={i}
                            className="sparkle absolute rounded-full bg-gold"
                            style={{
                                top: s.top,
                                left: s.left,
                                width: s.size,
                                height: s.size,
                                animationDelay: s.delay,
                            }}
                        />
                    ))}

                    {/* thin gold ring behind logo */}
                    <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border border-gold/40" />
                    <div className="absolute w-[380px] h-[380px] md:w-[460px] md:h-[460px] rounded-full border border-primary/10" />

                    {/* rose branch line-art, bottom-left corner of the ring */}
                    <svg
                        className="absolute -bottom-6 -left-6 w-40 h-40 text-primary/25"
                        viewBox="0 0 200 200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                    >
                        <path d="M10 190 C 40 160, 30 120, 60 100 C 90 80, 80 50, 110 30" />
                        <circle cx="60" cy="100" r="6" />
                        <circle cx="90" cy="65" r="5" />
                        <circle cx="115" cy="35" r="4" />
                        <path d="M60 100 C 50 95, 45 105, 40 100" />
                        <path d="M90 65 C 100 60, 105 70, 98 75" />
                    </svg>

                    {/* rose branch line-art, top-right corner of the ring */}
                    <svg
                        className="absolute -top-6 -right-6 w-40 h-40 text-gold/40"
                        viewBox="0 0 200 200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                    >
                        <path d="M190 10 C 160 40, 170 80, 140 100 C 110 120, 120 150, 90 170" />
                        <circle cx="140" cy="100" r="6" />
                        <circle cx="110" cy="135" r="5" />
                        <circle cx="85" cy="165" r="4" />
                    </svg>

                    {/* LOGO */}
                    <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
                        <Image
                            src="/images/icon.png"
                            alt="Flow — Flowers and Gifts"
                            fill
                            priority
                            className="object-contain drop-shadow-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </section>
    );
};

export default Hero;
