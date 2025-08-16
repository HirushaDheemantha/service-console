// dashboard-app/lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Export cn for tailwind class merging
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// ✅ Handle direct or proxy API
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL // → http://localhost:4000
    : "/api/proxy"; // → goes through the Next.js proxy

export const getServices = async () => {
  try {
    const url = `${BASE_URL}/services`;
    console.log("Fetching from:", url);

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();
    console.log("Raw response:", text.slice(0, 100));

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("getServices error:", err);
    throw err;
  }
};

export const createService = async (data: any) => {
  try {
    const url = `${BASE_URL}/services`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("createService error:", err);
    throw err;
  }
};
