const BASE = process.env.NEXT_PUBLIC_API_URL + "/api";

export async function fetchCategories() {
   const res = await fetch(`${BASE}/categories`, {
      next: { revalidate: 60 },
   });
   return res.json();
}

export async function fetchOccasions() {
   const res = await fetch(`${BASE}/occasions`, {
      next: { revalidate: 60 },
   });
   return res.json();
}

export async function fetchSectionSummaries() {
   const res = await fetch(`${BASE}/sections/summaries`, {
      next: { revalidate: 60 },
   });
   return res.json();
}
