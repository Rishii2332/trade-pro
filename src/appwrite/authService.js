const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

const BASE_URL = "https://api.twelvedata.com";

export async function getQuotes(symbols) {

    const url =
        `${BASE_URL}/quote` +
        `?symbol=${symbols.join(",")}` +
        `&apikey=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok || data.status === "error") {

        throw new Error(
            data.message || "Failed to fetch market data"
        );

    }

    return data;
}