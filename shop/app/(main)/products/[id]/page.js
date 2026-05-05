"use client";
import { useState } from "react";
import ProductsContainer from "@/app/\(main\)/components/ProductsContainer";

const product = {
  title: "Eternal Love Roses",
  subTitle: "99 Premium Red Roses",
  price: 7800,
  imgPath:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
  imgAlt: "ClassNameNameic Red Rose Bouquet",
  status: "Bestseller",
};
const productImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBw6SZgBqJj8VFSxmLd-xNOqZOmTNqXz52G81roG_nXpHxr6MEoFXKSHx3maDm5KDwHYwM0_7lDQd_KhaeobTFB-D4UomUu4E1oj5MUZ5OtopKZE0KCQhLh27oA3VdV0_VMGkmqpR-F-RbfleMLrt3cmeIxp4aJllvpNXwNZbMLba46FymPCu8ORnJi4XpoQ29gLkfUE46EHGGhUBH7bxu6mCeXXG-B0BBSz9kgU34NgLxX4l1C0eyBDJyl_XaqjVp4HyymcUyQl1V_",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCs5bFWEDYEdSAPUJnGW2j8yYYK88U9kXXBUWqsyAxriYLiJfXV85eqT6gUAuw7MU_BNAAkouyF7E6Vs5CIQ_s_pMDJw1MsspO6MuK1ZHVWGqIRw5kgmdvmST2n-IQbr2naLQ3kWrEuybYtXHVf71YYpkee2WFpWSAJ06PD-0F0xpnH3mDnnl45JCm6Rw2oMv36vmSZzHC1TTaoG-u6hWGsS6UG64ysm_6Wjphj7FocMjjQBPhMqBo3i64hkt7Gsd1u7Hf3R-MpNv8n",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGIt259eTyFphECHQ2za1osPojWLaKKLXYszPKoAM2n7zS5-oc5lV-PXq4az_qKhjpNqLVTeJrh2ni2AdKEVsDe2jUFtI6N8juRt0QD_y8TcAOoMU7IvobAB4Rn87Uc6zXTvj5pP5hIEJmHz-WGx-MkrB9mYYmq_h8cckJxCQUlvA7xC3Ey23ld228rQhBgFkuXHM2mhIgtQcmQU-zO8Wc34QuqiRDLNy9Vwu7rZMFsIcYwI16ySC3xeBkJruZLFfKz4YlhMnxQMLC",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuApqfr29JFP6zydwTE8lEx2DCkInL_uxZzzPRc5ogwh455isr-RegfaBJd9E0_fpEBS_BOxUUQCAQkVxPPRt0c_1ZZaJB4oLBsK5i6c3ViZM9BEZNHpyvWi9DYemC0sNMhWoRT9iRel4q3_euMtmuVTguyW9-ubttjiEcgVPTFBLWEAgSs4B6fFyvcTuT-X-hf0O1atXrD8IdJpltaUFJNGywLuqLo8NEr8Spx3b_4krtXOW3DdBIX_XWo_6k2h0nyFMDTZfddPXf6c",
];
const relatedProducts = [
  {
    title: "Eternal Love Roses",
    subTitle: "99 Premium Red Roses",
    price: 7800,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
    imgAlt: "ClassNameic Red Rose Bouquet",
    status: "Bestseller",
  },

  {
    title: "Vanilla Dream Spa",
    subTitle: "Luxury Relaxation Set",
    price: 3432,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByifH3omNp_Kmw739Bdi-Lp0KgxSD-OU1EaHXuowkLWbkNIHwJ0xm6dbk-EOi0RtxgwQhpEcOzj8jciIjqmVdBIrBbSccY6GXHpLQpd76TQ2v8bygq-sKtb2SpgPem8mPMWAUd9AhEkSiEF56EWrwHroEyfyzsOHUCJRMUs_MVPNbJqaCdWkbT7ipQFK87EB0_yc8n2HaHyuV36qbd4F22P0JRJ5WoaGDKHbDit0TT5YnEkJPWzABu4cibCk0DCaVJbTWUXFtPdmus",
    imgAlt: "Vanilla &amp; Gold Spa Set",
    status: null,
  },
  {
    title: "Royal Orchid Mix",
    subTitle: "Ceramic Signature Box",
    price: 5672,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqT6gxQ4_Th0SUYlrjMEE0FUhoiWfS643ut624e0gn8Q2CvYJlCEkDqbeUbmbu-O2v6rmyhcVFLp6ZxaiiIKXZBSmQoBXnfSmA1YZIqsYc1NaMo5Q7VrH5EjZdHDfqNyBurIvoeQ28adT7hsOsI1ZTzrDneSNLA-8mzGOBb0yGDfA7dMlyjRRcVLJ50br-EhCqObXa8TvqHNDyymhPPndcPG-e-3TSYifVo9e3ld9WT_uDP751j16tKiVdToLZ1lNf-8XzBBeUNcZL",
    imgAlt: "Orchid &amp; Rose Box",
    status: "Limited",
  },
  {
    title: "Pastel Symphony",
    subTitle: "Mixed Seasonal Blooms",
    price: 3706,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    imgAlt: "Pastel Dreams Arrangement",
    status: null,
  },
];

export default function Product() {
  const [descIsOpen, setdescIsOpen] = useState(false);
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Product Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-slate-50 dark:bg-surface-dark rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <img
              alt={product.imgAlt}
              className="w-full h-full object-cover"
              src={product.imgPath}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, i) => (
              <div
                className="aspect-square rounded-lg overflow-hidden border-2 border-primary ring-offset-2 ring-2 ring-primary/20"
                key={i}
              >
                <img
                  alt={`Thumbnail ${i}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                  src={image}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                In Stock
              </span>
              <span className="text-xs text-slate-400 font-mono tracking-tighter">
                SKU: FLHARJ85741
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-medium leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-lg">
                  verified
                </span>
                <span>
                  In collaboration with{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    Areej
                  </strong>
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-surface-dark/50">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Select Size
              </label>
              <div className="flex items-center justify-between p-4 border-2 border-primary rounded-lg bg-white dark:bg-background-dark">
                <span className="font-medium">One Size</span>
                <span className="font-bold text-lg">EGP {product.price}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 p-6 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-surface-dark/50 flex flex-col justify-center">
                <span className="text-xs text-slate-400 uppercase tracking-tighter">
                  Price Includes VAT
                </span>
                <span className="text-3xl font-bold">EGP {product.price}</span>
              </div>
              <button className="flex-[1.5] bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">
                  add_shopping_cart
                </span>
                Add to Cart
              </button>
            </div>
          </div>
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pay in installments with
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center font-bold italic text-blue-600">
                    valU
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Split into 5 payments of 514.8 EGP
                    </p>
                    <p className="text-[11px] text-slate-400">
                      No interest, no registration fees.
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </div>
              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-3 py-1 font-bold uppercase tracking-tighter transform rotate-45 translate-x-5 translate-y-[-2px]">
                  0% Interest
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-600 rounded-lg shadow-sm flex items-center justify-center font-bold text-white text-xs">
                    sympl.
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Pay over 3 or 4 months
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Starting from EGP 858/mo
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button
              className="w-full py-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors"
              onClick={() => setdescIsOpen(!descIsOpen)}
            >
              Description
              <span className="material-symbols-outlined text-sm">
                expand_more
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                descIsOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {product.subTitle ||
                  "No description provided for this product."}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* More Products */}
      <section className="mt-32 mb-20">
        <h2 className="text-3xl font-bold mb-12">You Might Also Love</h2>
        <ProductsContainer products={relatedProducts} />
      </section>
    </main>
  );
}
