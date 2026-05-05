"use client";

import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperNavButtons from "./SwiperNavButtons";
import { useDispatch } from "react-redux";
import { add } from "../features/cart/cartSlice";
export default ({ products }) => {

  const dispatch = useDispatch();
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={2}
      breakpoints={{
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 25,
        },
        1300: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      }}
    >
      {products.map((product, i) => (
        <SwiperSlide key={i}>
          <div className="product-card group relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-4 bg-slate-50">
              {product.status != null ? (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur dark:bg-slate-900/90 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                  {product.status}
                </span>
              ) : (
                ""
              )}
              <img
                alt={product.imgAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={product.imgPath}
              />
              <div className="product-action absolute bottom-6 left-0 right-0 px-6">
                <button
                  className="cursor-pointer w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xl
                  "
                  onClick={() => dispatch(add(product))}
                >
                  <span className="material-symbols-outlined text-sm">
                    shopping_bag
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="flex justify-between items-start max-h-12">
              <div>
                <a
                  href={`products/${product.id}`}
                  className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1"
                >
                  {product.title}
                </a>
                <p className="text-sm text-slate-400 line-clamp-1">
                  {product.subTitle}
                </p>
              </div>
              <span className="font-bold text-primary text-right">
                EGP {product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <SwiperNavButtons />
    </Swiper>
  );
};
