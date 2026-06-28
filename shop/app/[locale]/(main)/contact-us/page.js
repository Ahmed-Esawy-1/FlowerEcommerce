import React from "react";

const page = () => {
   return (
      <div className="bg-background-light  font-display text-slate-900 ">
         <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <main className="flex-1">
               <div className="relative w-full h-[409px] bg-slate-900 overflow-hidden">
                  <div
                     className="absolute inset-0 bg-cover bg-center opacity-60"
                     data-alt="Close up of elegant pink roses with morning dew"
                     style={{
                        backgroundImage: `url(
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuA3c_2SxQ3WDW024IYRn8eLADBvmPc6QAtYO9ybCYxh7tBesJrc0dFUXKEp3FbagV6EHhenszAcL4lDfEo9P2VlABTBG1hYpmQjTHnJ1pwtPB48N99ulYKRcXIVW3yDqWUc_cZZZmKt85o46dHWq1aO1FpTFYw_XQJnu0QzwpVPhK6LiIxnbJlWvWMzeYPpFUyRgbS02xoOr9TDmLJbC0xmcXKwTFbwVP7QPws7MTt8wTQEw-NDaZh8EXRQQl6V4zE-qNEozLqMwwnw",
                )`,
                     }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-light  to-transparent"></div>
                  <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                     <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">
                        Connect with us
                     </span>
                     <h1 className="text-4xl md:text-6xl font-serif font-light text-slate-900  mb-4 italic">
                        Get in Touch
                     </h1>
                     <p className="max-w-xl text-slate-600 font-display leading-relaxed">
                        For bespoke arrangements, corporate partnerships, or
                        simple inquiries about our daily collections.
                     </p>
                  </div>
               </div>
               <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                     <div className="space-y-12">
                        <div className="space-y-6">
                           <h3 className="text-2xl font-serif text-slate-900  italic">
                              Our Atelier
                           </h3>
                           <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                 <span className="material-symbols-outlined text-primary">
                                    location_on
                                 </span>
                                 <div>
                                    <p className="font-bold text-slate-900 ">
                                       The Flower House
                                    </p>
                                    <p className="text-slate-600">
                                       124 Mayfair Gardens, London, W1K 4QT
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <span className="material-symbols-outlined text-primary">
                                    call
                                 </span>
                                 <div>
                                    <p className="font-bold text-slate-900 ">
                                       Contact Number
                                    </p>
                                    <p className="text-slate-600">
                                       +44 (0) 20 7946 0123
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <span className="material-symbols-outlined text-primary">
                                    mail
                                 </span>
                                 <div>
                                    <p className="font-bold text-slate-900 ">
                                       Email Address
                                    </p>
                                    <p className="text-slate-600">
                                       concierge@flowrista.com
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h3 className="text-2xl font-serif text-slate-900  italic">
                              Opening Hours
                           </h3>
                           <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                              <p>Monday - Friday</p>
                              <p className="text-right">08:00 AM - 07:00 PM</p>
                              <p>Saturday</p>
                              <p className="text-right">09:00 AM - 06:00 PM</p>
                              <p>Sunday</p>
                              <p className="text-right">10:00 AM - 04:00 PM</p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h3 className="text-2xl font-serif text-slate-900  italic">
                              Follow our Bloom
                           </h3>
                           <div className="flex gap-4">
                              <a
                                 className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                 href="#"
                              >
                                 <span className="material-symbols-outlined text-xl">
                                    share
                                 </span>
                              </a>
                              <a
                                 className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                 href="#"
                              >
                                 <span className="material-symbols-outlined text-xl">
                                    camera
                                 </span>
                              </a>
                              <a
                                 className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                 href="#"
                              >
                                 <span className="material-symbols-outlined text-xl">
                                    public
                                 </span>
                              </a>
                           </div>
                        </div>
                        <div className="rounded-xl overflow-hidden h-64 w-full shadow-xl border border-primary/10">
                           <img
                              className="w-full h-full object-cover"
                              data-alt="Map location of Mayfair London"
                              data-location="London"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMtOIhVuv9Mo4qg2U2CNEWWfPLITQXdx6l-ogUiM134Jm-5LFJ6sXlbUw0ksTCP9SrITR7RujhoU237QqiqFmLmw6KMaKWfGPFNJcIEn3yQHvNtM_zyMekPUoILbEH_gAVriAz3CAnfw10PI5kENJn_6gDbSsqRwGQB4Y9NnpG_bVunqi37xfxPlNQaxtyZA-Sm5o_OZnM_Y8bkfU_xLGuKJB-di_BXre4_Jpm6NEt7nbpyKeWqWIXDS6HGdXeWo8_UgtRml7s-Cw2"
                           />
                        </div>
                     </div>
                     <div className="bg-white /50 p-8 md:p-12 rounded-2xl shadow-2xl border border-primary/5">
                        <form className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
                                    Full Name
                                 </label>
                                 <input
                                    className="w-full bg-transparent border-0 border-b border-slate-200  focus:ring-0 focus:border-primary px-0 py-3 text-slate-900  placeholder:text-slate-400"
                                    placeholder="Your name"
                                    type="text"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
                                    Email Address
                                 </label>
                                 <input
                                    className="w-full bg-transparent border-0 border-b border-slate-200  focus:ring-0 focus:border-primary px-0 py-3 text-slate-900  placeholder:text-slate-400"
                                    placeholder="email@example.com"
                                    type="email"
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
                                 Subject
                              </label>
                              <select className="w-full bg-transparent border-0 border-b border-slate-200  focus:ring-0 focus:border-primary px-0 py-3 text-slate-900  appearance-none">
                                 <option className="">General Inquiry</option>
                                 <option className="">
                                    Bespoke Arrangement
                                 </option>
                                 <option className="">
                                    Wedding &amp; Events
                                 </option>
                                 <option className="">
                                    Corporate Partnership
                                 </option>
                                 <option className="">Press &amp; Media</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
                                 Your Message
                              </label>
                              <textarea
                                 className="w-full bg-transparent border-0 border-b border-slate-200  focus:ring-0 focus:border-primary px-0 py-3 text-slate-900  placeholder:text-slate-400 resize-none"
                                 placeholder="How can we assist you today?"
                                 rows="5"
                              ></textarea>
                           </div>
                           <button
                              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                              type="submit"
                           >
                              <span className="uppercase tracking-[0.2em] text-sm">
                                 Send Inquiry
                              </span>
                              <span className="material-symbols-outlined">
                                 east
                              </span>
                           </button>
                           <p className="text-xs text-center text-slate-400 italic">
                              We aim to respond to all inquiries within 24
                              business hours.
                           </p>
                        </form>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      </div>
   );
};

export default page;
