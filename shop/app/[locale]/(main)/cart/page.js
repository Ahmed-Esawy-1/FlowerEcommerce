"use client";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCartItems,
   selectCartLoading,
   remove,
   increase,
   decrease,
} from "../../../../features/cart/cartSlice";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function page() {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const cartItems = useSelector(selectCartItems);
   const cartLoading = useSelector(selectCartLoading);
   const dispatch = useDispatch();

   console.log(cartItems);

   const subtotal = useMemo(
      () =>
         cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      [cartItems],
   );

   return (
      <div className="flex-1 px-6 md:px-20 py-10">
         {/* Header */}
         <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
               <h2 className="text-slate-900 text-4xl font-extrabold tracking-tight">
                  Your Cart
               </h2>
               <p className="text-primary/70 text-lg font-medium">
                  Review your luxury floral selection before checkout.
               </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Loading */}
                  {cartLoading && (
                     <div className="flex items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
                     </div>
                  )}

                  {!cartLoading && cartItems.length === 0 && (
                     <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                           Your cart is empty
                        </h2>
                        <p className="text-slate-500 ">
                           Add some items to get started!
                        </p>
                     </div>
                  )}
                  {/* Items */}
                  {!cartLoading &&
                     cartItems.map((item) => (
                        <div
                           className="flex flex-col md:flex-row gap-6 bg-white  p-6 rounded-2xl border border-primary/5 shadow-sm"
                           key={item.id}
                        >
                           <div className="aspect-square  w-full md:w-40 h-40 shrink-0">
                              <img
                                 src={`${apiUrl}${item.image}`}
                                 className="w-full h-full no-repeat cover rounded-xl"
                              />
                           </div>
                           <div className="flex flex-1 flex-col justify-between py-1">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h3 className="text-slate-900 text-xl font-bold">
                                       {item.title}{" "}
                                       {item.color && "| " + item.color}
                                    </h3>
                                    <p className="text-primary font-semibold text-lg mt-1">
                                       EGP {item.price}
                                    </p>
                                    <p className="text-slate-500  text-sm mt-2">
                                       {item.description}
                                    </p>
                                 </div>
                                 <button
                                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    onClick={() => dispatch(remove(item.id))}
                                 >
                                    <DeleteIcon />
                                 </button>
                              </div>
                              <div className="flex items-center gap-4 mt-4">
                                 <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-1 border border-primary/10">
                                    <button
                                       className={`flex h-8 w-8 items-center justify-center rounded-md ${item.quantity == 1 ? "bg-gary-300" : " bg-white  text-primary hover:bg-primary hover:text-white cursor-pointer"} transition-all shadow-sm`}
                                       onClick={() =>
                                          dispatch(decrease(item.id))
                                       }
                                    >
                                       <RemoveIcon fontSize="small" />
                                    </button>
                                    <span className="text-slate-900 font-bold w-4 text-center">
                                       {item.quantity}
                                    </span>
                                    <button
                                       className={`flex h-8 w-8 items-center justify-center rounded-md ${item.quantity == 3 ? "bg-gary-300" : " bg-white text-primary hover:bg-primary hover:text-white cursor-pointer"} transition-all shadow-sm`}
                                       onClick={() =>
                                          dispatch(increase(item.id))
                                       }
                                    >
                                       <AddIcon fontSize="small" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
               {/* Order Summary */}
               <div className="lg:col-span-1">
                  <div className="bg-white  p-8 rounded-2xl border border-primary/10 shadow-lg sticky top-28">
                     <h2 className="text-slate-900 text-2xl font-bold mb-6">
                        Order Summary
                     </h2>
                     <div className="flex flex-col gap-4 text-slate-600 ">
                        <div className="flex justify-between items-center">
                           <span>Subtotal</span>
                           <span className="text-slate-900 font-semibold">
                              {subtotal}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span>Luxury Packaging</span>
                           <span className="text-slate-900 font-semibold">
                              $15.00
                           </span>
                        </div>
                        <div className="h-px bg-primary/10 my-2"></div>
                        <div className="flex justify-between items-center text-slate-900 text-xl font-extrabold">
                           <span>Total</span>
                           <span>EGP {Number(subtotal) + 15}</span>
                        </div>
                     </div>
                     <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl mt-8 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        <span>Proceed to Checkout</span>
                        <ArrowForwardIcon />
                     </button>
                     <div className="mt-6 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                           <LockIcon fontSize="small" />
                           <span>Secure 256-bit SSL Encrypted Payment</span>
                        </div>
                        <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                           <CreditCardIcon />

                           <PaymentIcon />

                           <AccountBalanceWalletIcon />
                        </div>
                     </div>
                  </div>
                  <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/10">
                     <div className="flex gap-4 items-start">
                        <VerifiedIcon className="text-primary" />
                        <div>
                           <p className="text-slate-900 font-bold text-sm uppercase tracking-wider">
                              The Flowrista Promise
                           </p>
                           <p className="text-slate-500 text-xs mt-1">
                              Hand-selected fresh blooms guaranteed to stay
                              vibrant for 7 days or we replace them.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
