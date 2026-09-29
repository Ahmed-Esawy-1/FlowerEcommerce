const BASE = process.env.NEXT_PUBLIC_API_URL + "/api";

const fetchOptions = {
    next: { revalidate: 3600, tags: ["collections"] },
};

export async function fetchCategories() {
    try {
        const res = await fetch(`${BASE}/categories`, fetchOptions);
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function fetchOccasions() {
    try {
        const res = await fetch(`${BASE}/occasions`, fetchOptions);
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch occasions:", error);
        return [];
    }
}

export async function fetchSectionSummaries() {
    try {
        const res = await fetch(`${BASE}/sections/summaries`, fetchOptions);
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch section summaries:", error);
        return [];
    }
}
