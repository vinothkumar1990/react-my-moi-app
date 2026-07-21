export const API_URL = import.meta.env.VITE_API_URL;

export const API_KEY = import.meta.env.VITE_API_KEY;

export const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};