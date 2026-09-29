import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
   const ref = useRef(null);
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
      const ele = ref.current;
      if (!ele || isVisible) return;

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               setIsVisible(true);
               observer.disconnect();
            }
         },
         { rootMargin: "150px", threshold: 0, ...options },
      );

      observer.observe(ele);
      return () => observer.disconnect();
   }, [isVisible]);

   return { ref, isVisible };
}
