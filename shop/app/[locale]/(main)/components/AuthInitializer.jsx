"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/lib/api/homeApi";
import { setUser } from "@/features/auth/authSlice";

export default function AuthInitializer({ children }) {
   const dispatch = useDispatch();
   const { data } = useGetMeQuery();

   useEffect(() => {
      if (data?.user) {
         dispatch(setUser(data.user));
      } else {
         dispatch(setUser(null));
      }
   }, [data, dispatch]);

   return children;
}
