import Link from "next/link";
import ProductsContainer from "./components/ProductsContainer";

const categories = [
  {
    id: 1,
    name: "Bouquets",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6zBBK79abfwWMsRMtiQTBUFcz0B8usHiWxFr_qJLDn98g_Nrnkm1cEZDHQaXb0KL-FmIkKyNE0U2jA4BtT2qGPQSrwqG5qbO0z3fwUeN4r07KuvQEyNSf2nk58StJVxFiBWjn5aJZXiwgOqCj6G1S7pL7UFFurRSn6V6Dq49-cqjjj-Y6KLNe_fo_4nXor4cUKxv4QHy8G1vMJl5DKJTVKV8j9fpyaWFmTws8otjLfEn_vS9ky1uLhyO7Nph-h3n2Q0lLFkLXOvU8",
    imgAlt: "Flower Bouquets",
  },
  {
    id: 2,
    name: "Gift Boxes",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTpKNzvM8MnJjh8EYTK_iEvfxZXD9rUGlxSDoYbjbgJlUPKlwQtBbyKT2yyPaN6yM6OUD4sGS7blQxk2hSduXNiTl5Cu21-fV5JTjxFJBJO00L_Uckjg0DBUK_uthgNkKeezmWgWUgN86iRBkwBd14ch0da0nmtj7BbUbV3diMhaRRWI8S1n_9p-JirVbA_NSohWZEfn9L7MRqmZn8vqL9X2GMmCIMj75__uWSK8l_Y00RaaUhnlLVNsw-QKncxylUwirbi5Rb4mq5",
    imgAlt: "Gift Boxes",
  },
  {
    id: 3,
    name: "Perfumes",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtDNs6XzAj9lzwoFM3SSvNKBjLrV-f_rJWTsI4_5F_Au3JFv3ETJz5elQx93ixpbnNt1F4q3E02BzPkFN8kqgjy9bD_9jQyCbukIErGi6fx_XlxvIj5LBy9NqkE0TCgpi80fQollP2q1wfldqx4XcFSI_yg-TLAZXtJMtBxmLf5xfOMPP43LEM68bE25T-6I1DUgTnOyxRmQ40Lqcw2WrUJ7RHHi39_yDSOyG5t2RdmPZ-X9fqzbk0ncLFDK3lBMR-jAb9SRhugGiM",
    imgAlt: "Luxury Perfumes",
  },
  {
    id: 4,
    name: "Plants",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2lw-N4_lMGnsFhN9s7aHXyaLx3Ix_X2PSpKT3htyYAYBTSWGmXKLVnsfwWtBt_-h7SiqA-EOTIUUNWopvebSQvtZPHKLMYMMjS_XYNXnMP06IfaoUYmAP9W0Bivpc2kYIL-oGUQkfg_NwE7kTAWix2CdjDo17IpV7TPiB-gCc6Lupm9KPxD-0_0Qa2ydTNkpFxcjgkSj8AxPZw7ClCupSUgXWzG2ol1rtHgd1wemwRLdiKvcvV8BBwb22EKuge4QJo5pZsMh0FHjc",
    imgAlt: "Indoor Plants",
  },
  ,
  {
    id: 5,
    name: "Jewelry",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxjrOi7s9TqzBCT1W6AxKP2xdMkcG4w-aNBR80zPNALv2cfQs1UVsHo706Cd7Lldc8PP53OMWgUXIGFWtI28p46PlZCcegwct4LOAwC6Vmvs9KGBImPV4PRQsyper8bCH3bm_zE1KTtDlG3ar5HCr0kNZ3cdQQGFzkF5KA4vVnPsexrVDfn2gf5cxM7QMilhctPh3QAYiQbEd-8OM3-JDe26B3HWN4Z-caJNX-eQXV4WWs7EGUGL6JvZH8jWuYaXRWAxmU5RKQWpWB",
    imgAlt: "Luxury Watches",
  },
  {
    id: 6,
    name: "Sweet",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5NJvMAOGRZtvfcBTddmeTBto0ZMH-xz3hXYvQQoaL3HOsixmF6jbt7LCKKAqe6v3ZW8_iUbSbAARt2mbyg_py9NT9x2OBIYzWDEYQrCuB5DLeFGpWg6mlUNQXfenlVIDmFcshhCqC99POJZwEszrHCza_b2QXlOhERZFDr45bgXWtqoaNeg0-qBAX_-kwYtQWKrcmubQHdzJqTvqUVqSYgSkNbLdFwEii5uRCK3bccLY0RH5hgZ471hyqf-Ilh_Q829ULcxxQhzKY",
    imgAlt: "Sweets Treats",
  },
  {
    id: 7,
    name: "Ramadan",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqcHFKoW1fW2wfWURd-jSOm2ZDfLt2uPa_s0vtxey2_XBFzEbiGIhx_u462drQ6h0m5ZtRur3J-Pfm8BaobaAklRxOOvK3eQKhAe0hhrXSbSHDMemClYSQZ5cjyHLhNwlAYXaNhGXXSHR3wY1nRkOcBuwE5KB31FfcZHMBVNzJdaIk0y0gkH-9ls4tXfqI4kVkDrDJRtidFcGP2AtleblQKPWDTF2qGACDnHvmKBB_P6T-RcMsYDIrR5alpEpH9ZY96h4ed-NCHaMk",
    imgAlt: "Ramadan crescent decoration",
  },
  {
    id: 8,
    name: "Mother's Day",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCku9F2VZ70Ba1EyxPgUcg6bPMmepuHihRQMmPYmXFBSzHZnruuFQbLX5l7satOMaL9SXrsyBsmf5XeQbudYVaI80Q_XYmddocpUWgZFYDKtRJlfrxCoQOTMbBgt6LSQWAX545TEow34ZazjlzPkGqn5EsdipYCNOeS65SCb-6hIdPq_aBsCNwT78b0s5kU0NX5BT_7pc0GQbbaYpHjvR04tvGAmg1czhrYqhnOoNc93WF2pINX_JfeT-GVWbNBZx-A7lbE3TB_r7Tu",
    imgAlt: "Pink flowers for Mother's Day",
  },
  {
    id: 9,
    name: "Birthdays",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD57yXc_BUIZwLiaVjMw2Zka7dj2t29iv1BX-mxMcp6U6EnkGds8PP5cAk5OKTFYKF88P8GsViRtq4tmWoAbHQJSVwZ-g4s56PV5NdDbzhYSHA__6MSybjhprZOY4qYTbJbUakiCisC3COypjXOWqUW3K4-DYXZto4E0WXBGYJul0dggyrsUUk5u25p4yRT2bQ7qBQ4dAwDED7oKrDsBmZB2Yd0nnFqp56EN4HaVFMvIR39whIA2YlNM2meGdLDETxWCLaBBggv-NAT",
    imgAlt: "Celebration cake and flowers",
  },
  {
    id: 10,
    name: "Anniversary",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA21Sw4endj0L8IpF831_VFJlLq9Ze5XcGZPPvgLRhs7j5QHjJHEbZ4rsfD0aR5-R7e0t02lsKzSDp4BGiTwTjPNpk6AYDHuBul0LSMRFm6z14RFsqxmkp6znBYj6ZejLM5TveFbVE8Rkw7O1keHSOjz5-SZu93y_9l9AXVucApBEnmeirmR1NcZy1DVYI9p9p6JCTgfwSJOWJfb4JQYlT82uFI33rFG1plkxW46kU505LuDHZqNqIPWabYN_I2x03oRZT_o9GDSUMq",
    imgAlt: "Romantic flower setting",
  },
  ,
  {
    id: 11,
    name: "Wedding",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1UvXPKUZsAxYQHt_VpzjFqz8sZYyutGuX8eOcuDe322JMFgr3_XpfgT29oYEijo6HvOk4rhbnbJHZTps3ZQCLY0QPkdrlIIViyaZ7l-sanQHaipev5pDWLLRWb1fhXHsbvFTw8qLBOuWqxrSeOZc4rVK9kDBE4fh7JAkcZY_uhPPvHiY16MGDB1TAxgbxPmACRguKRd0HlQwpdPjySh-YvzQy97KaBC1-biQhcAj_RX21LsMGygmk7rv-vTxY6FHkWhH6elAY4-7N",
    imgAlt: "Wedding rings and white roses",
  },
  {
    id: 12,
    name: "Graduation",
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpqkNeWfCIxVipo7x3UvSOfA_Pi7N9Iz58s9O9qV_ps_On46Viou0eE0BJPwOIwjEZxvqfw94sGiBWmt72PBscBOhQDzp16kncmh4XkxwOL_mxUr0N0i492zvjvX5Ej7pjjbvuGA-FbEKtlcrBU7yltWnBBPjArEzy1pcirB3EMHWxzwmhx-HDmmOQIftLByj3q2aFMPcPD8BFeBg4IH6Ady4d3sq3zU2cRdAJP7gatlGgpug-YTTQcAlyFhyiDQl_ot8wWWfk_94-",
    imgAlt: "Graduation cap and flowers",
  },
];
const bestSellers = [
  {
    id: 1,
    title: "Eternal Love Roses",
    subTitle: "99 Premium Red Roses",
    price: 7800,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
    imgAlt: "ClassNameic Red Rose Bouquet",
    status: "Bestseller",
  },
  {
    id: 2,
    title: "Vanilla Dream Spa",
    subTitle: "Luxury Relaxation Set",
    price: 3432,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByifH3omNp_Kmw739Bdi-Lp0KgxSD-OU1EaHXuowkLWbkNIHwJ0xm6dbk-EOi0RtxgwQhpEcOzj8jciIjqmVdBIrBbSccY6GXHpLQpd76TQ2v8bygq-sKtb2SpgPem8mPMWAUd9AhEkSiEF56EWrwHroEyfyzsOHUCJRMUs_MVPNbJqaCdWkbT7ipQFK87EB0_yc8n2HaHyuV36qbd4F22P0JRJ5WoaGDKHbDit0TT5YnEkJPWzABu4cibCk0DCaVJbTWUXFtPdmus",
    imgAlt: "Vanilla &amp; Gold Spa Set",
    status: null,
  },
  {
    id: 3,
    title: "Royal Orchid Mix",
    subTitle: "Ceramic Signature Box",
    price: 5672,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqT6gxQ4_Th0SUYlrjMEE0FUhoiWfS643ut624e0gn8Q2CvYJlCEkDqbeUbmbu-O2v6rmyhcVFLp6ZxaiiIKXZBSmQoBXnfSmA1YZIqsYc1NaMo5Q7VrH5EjZdHDfqNyBurIvoeQ28adT7hsOsI1ZTzrDneSNLA-8mzGOBb0yGDfA7dMlyjRRcVLJ50br-EhCqObXa8TvqHNDyymhPPndcPG-e-3TSYifVo9e3ld9WT_uDP751j16tKiVdToLZ1lNf-8XzBBeUNcZL",
    imgAlt: "Orchid &amp; Rose Box",
    status: "Limited",
  },
  {
    id: 4,
    title: "Pastel Symphony",
    subTitle: "Mixed Seasonal Blooms",
    price: 3706,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    imgAlt: "Pastel Dreams Arrangement",
    status: null,
  },
  {
    id: 5,
    title: "Pastel Symphony",
    subTitle: "Mixed Seasonal Blooms",
    price: 3706,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    imgAlt: "Pastel Dreams Arrangement",
    status: null,
  },
];
const services = [
  {
    title: "Same Day Delivery",
    body: "Fast and fresh delivery within hours across the city for those last minute surprises.",
    icon: "local_shipping",
  },
  {
    title: "Premium Quality",
    body: "We source our blooms from the finest growers globally to ensure long-lasting freshness.",
    icon: "verified",
  },
  {
    title: "Rewards Program",
    body: "Earn points with every purchase and redeem them for exclusive discounts and gifts.",
    icon: "loyalty",
  },
];
export default function Home() {
  return (
    <main>
      <section className="relative h-[80vh] overflow-hidden">
        <img
          alt="Luxury Pink Peonies"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq5z08bFlN65avApNSUiLpQddHTbP6jDnFG7PfPV51wQ9yrSpKeNAPu_0Y4rck3t4Jvk74msWp-CQHiFZOGwlxacBR0qDKa-HxKGcynIAeJ5raVgTLmPyVslzGUnlHHHgjGIw8ceYCjfl99FoHWlt4MjkjiKPlcBwLZOLSXBI1_mWSFtg2BYbBQTOZacfphDA9GxsVv2xPtJ1esP2fneHS5o6IQo90jyswLaQIq7f9l0ZBUIpgM80fFcawRZnrRUTiCCzLwhW-fJIy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent dark:from-slate-900/60"></div>
        <div className="container mx-auto px-6 h-full relative flex flex-col justify-center items-start">
          <span className="text-primary font-semibold tracking-[0.3em] uppercase mb-4 block">
            New Ramadan Collection
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-slate-900 dark:text-white mb-6 leading-tight max-w-2xl">
            Gift the <br />
            <span className="italic font-normal">Spirit of Giving</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-lg">
            Discover our curated selection of bespoke floral arrangements and
            luxury gift sets designed for your most precious moments.
          </p>
          <div className="flex gap-4">
            <a
              className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-xl"
              href="#"
            >
              Shop Now
            </a>
            <a
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-4 rounded-full font-bold hover:bg-white transition-all border border-slate-200 dark:border-slate-700"
              href="#"
            >
              View Catalog
            </a>
          </div>
        </div>
      </section>
      {/* Category */}
      <section className="py-20 bg-accent-pink dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl mb-2">Shop by Category</h2>
              <p className="text-slate-500">
                Find the perfect expression for your feelings
              </p>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              href="/categories"
            >
              View All Categories{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.slice(0, 7).map((cat, i) => (
              <Link
                href={`/categories/${cat.id}`}
                className="group cursor-pointer"
                key={i}
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl transition-all">
                  <img
                    alt={cat.imgAlt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={cat.imgPath}
                  />
                </div>
                <p className="text-center font-bold text-sm uppercase tracking-wider">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Best Sellers */}
      <section className="py-20" id="bestSeller">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl mb-4">Our Best Sellers</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Handpicked favorites that have captured hearts and made moments
              unforgettable.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((item, i) => (
              <div className="product-card group relative" key={i}>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-4 bg-slate-50">
                  {item.status != null ? (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur dark:bg-slate-900/90 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                      {item.status}
                    </span>
                  ) : null}
                  <img
                    alt={item.imgAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={item.imgPath}
                  />
                  <div className="product-action absolute bottom-6 left-0 right-0 px-6">
                    <button className="cursor-pointer w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xl">
                      <span className="material-symbols-outlined text-sm">
                        shopping_bag
                      </span>
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`products/${item.id}`}
                      className="font-semibold text-lg mb-1 hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-slate-400">{item.subTitle}</p>
                  </div>
                  <span className="font-bold text-primary text-right">
                    EGP {item.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Products */}
      <section className="py-20 bg-accent-pink dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl mb-2">Our Best Sellers</h2>
              <p className="text-slate-500">
                Handpicked favorites that have captured hearts and made moments
                unforgettable.
              </p>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              href="/products"
            >
              View All Products{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <ProductsContainer products={bestSellers} />
        </div>
      </section>
      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl mb-2">Our Best Sellers</h2>
              <p className="text-slate-500">
                Handpicked favorites that have captured hearts and made moments
                unforgettable.
              </p>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              href="/products"
            >
              View All Products{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <ProductsContainer products={bestSellers} />
        </div>
      </section>
      {/* Products */}
      <section className="py-20 bg-accent-pink dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl mb-2">Our Best Sellers</h2>
              <p className="text-slate-500">
                Handpicked favorites that have captured hearts and made moments
                unforgettable.
              </p>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              href="/products"
            >
              View All Products{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <ProductsContainer products={bestSellers} />
        </div>
      </section>
      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl mb-2">Our Best Sellers</h2>
              <p className="text-slate-500">
                Handpicked favorites that have captured hearts and made moments
                unforgettable.
              </p>
            </div>
            <Link
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              href="/products"
            >
              View All Products{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <ProductsContainer products={bestSellers} />
        </div>
      </section>
      {/* Services */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {services.map((service, i) => (
              <div className="flex flex-col items-center" key={i}>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    {service.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-500">{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Partnerships */}
      <section className="py-16 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-10">
            Trusted Partnerships
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="h-8 font-display text-2xl font-black">PATCHI</div>
            <div className="h-8 font-display text-2xl font-black">PANDORA</div>
            <div className="h-8 font-display text-2xl font-black">GUESS</div>
            <div className="h-8 font-display text-2xl font-black">MARELLA</div>
            <div className="h-8 font-display text-2xl font-black">POLICE</div>
          </div>
        </div>
      </section>
      {/* Sign Up */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[30rem] -mr-40 -mt-20">
                local_florist
              </span>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-display text-5xl mb-6">
                Never miss a special <br />
                moment again.
              </h2>
              <p className="text-white/80 text-lg mb-10">
                Sign up for our newsletter to receive weekly inspiration,
                exclusive offers and early access to new collections.
              </p>
              <Link
                href="/signup"
                className="bg-white text-primary font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-transform"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
