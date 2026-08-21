const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;
console.log("API KEY EXISTS:", !!API_KEY);
console.log("API KEY LENGTH:", API_KEY?.length);
const BASE_URL = "https://api.twelvedata.com";

export async function getQuote(symbol) {

    const url =
        `${BASE_URL}/quote` +
        `?symbol=${encodeURIComponent(symbol)}` +
        `&apikey=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch market data");
    }

    const data = await response.json();

    if (data.status === "error") {
        throw new Error(data.message || "Market API error");
    }

    return data;
}