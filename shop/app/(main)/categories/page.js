import Link from "next/link";

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

const page = () => {
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">
          <Link className="hover:text-primary" href="/">
            Home
          </Link>
          <span className="material-symbols-outlined !text-[12px]">
            chevron_right
          </span>
          <span className="text-slate-900 dark:text-white">Occasions</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
          Floral Occasions
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Celebrate life's most precious moments with our curated selection of
          premium bouquets and bespoke gifts, handcrafted for every milestone.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, i) => (
          <Link
            className="group occasion-card relative overflow-hidden rounded-2xl aspect-[4/5] bg-slate-50 dark:bg-slate-800 transition-all"
            href={`/categories/${category.id}`}
            key={i}
          >
            <img
              alt={category.imgAlt}
              className="occasion-img absolute inset-0 w-full h-full object-cover transition-transform duration-700"
              src={`${category.imgPath}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            <h3 className="absolute bottom-6 left-6 text-white text-2xl font-display font-semibold mb-1">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>

      {/* <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
        id="promoModal"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row shadow-2xl">
          <div className="hidden md:block w-1/2 bg-slate-100 dark:bg-slate-800">
            <img
              alt="Gift bouquet"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU4G5mrDTaFJAdTW0JqUqMLJhnLBooCdzpYPnNrDccUkhPQTtGbZOavDHLihMWg9BD8BthpgNn9BpKFrbuW_34cQwMaXfkZTAZetuEui7Yaj9GKNYp9fBKHnadj_4A480Rad3LU0t2vUiiYuKmwIgPrkkvJY9Cx_CHeqmpvqhpSKOvfG9dVy7_rVs1rICUBWlKUjfa4Au8PaO8154_tzGsYFNu-b_sHX84wdgZ_cTjGRGpf2O5Tr3IJjpmPkpZUcxND_pGSoVPIvu9"
            />
          </div>
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              onclick="toggleModal()"
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <div className="space-y-6">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">
                Exclusive Offer
              </span>
              <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
                A special gift just for you!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Join our inner circle and enjoy 15% off your first luxury
                arrangement. Handcrafted with love.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    className="w-full px-0 py-3 bg-transparent border-t-0 border-x-0 border-b border-slate-200 dark:border-slate-700 focus:ring-0 focus:border-primary dark:focus:border-accent text-sm"
                    placeholder="Email Address"
                    type="email"
                  />
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-full font-semibold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Claim Your Gift
                </button>
                <button
                  className="w-full text-slate-400 text-xs hover:text-slate-600 transition-colors uppercase font-medium"
                  onclick="toggleModal()"
                >
                  No thanks, maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </main>
  );
};

export default page;
