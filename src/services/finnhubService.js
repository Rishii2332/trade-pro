const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export const FINNHUB_STOCKS = [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "GOOGL", name: "Alphabet" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "NVDA", name: "NVIDIA" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "META", name: "Meta" },
    { symbol: "NFLX", name: "Netflix" },
];

export const FINNHUB_SYMBOLS = FINNHUB_STOCKS.map((stock) => stock.symbol);

function formatMoney(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "--";
    return n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatSigned(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "--";
    const abs = Math.abs(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return n >= 0 ? `+${abs}` : `-${abs}`;
}

export function mapStockQuote(meta, quote = {}, lastPrice) {
    const previousClose = Number(quote.pc) || Number(meta.previousClose) || 0;
    const price = Number(lastPrice ?? quote.c) || 0;
    const change = previousClose ? price - previousClose : Number(quote.d) || 0;
    const percent = previousClose
        ? (change / previousClose) * 100
        : Number(quote.dp) || 0;

    return {
        name: meta.name,
        symbol: meta.symbol,
        previousClose,
        rawPrice: price,
        rawChange: change,
        price: formatMoney(price),
        value: formatMoney(price),
        change: formatSigned(change),
        percentage: `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`,
        positive: change >= 0,
    };
}

async function fetchFinnhub(path, params = {}) {
    if (!API_KEY) {
        throw new Error("Missing VITE_FINNHUB_API_KEY");
    }

    const url = `${BASE_URL}${path}?${new URLSearchParams({
        ...params,
        token: API_KEY,
    })}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch Finnhub data");
    }

    return data;
}

export async function getFinnhubQuotes() {
    const quotes = await Promise.all(
        FINNHUB_STOCKS.map(async (stock) => {
            const quote = await fetchFinnhub("/quote", { symbol: stock.symbol });
            return mapStockQuote(stock, quote);
        })
    );

    const ranked = [...quotes].sort(
        (a, b) => Math.abs(b.rawChange) - Math.abs(a.rawChange)
    );

    return {
        indices: quotes.slice(0, 4),
        watchlist: quotes,
        topGainers: ranked.filter((stock) => stock.positive).slice(0, 3),
        topLosers: ranked.filter((stock) => !stock.positive).slice(0, 3),
    };
}

export async function getFinnhubNews() {
    const feed = await fetchFinnhub("/news", { category: "general" });

    return (Array.isArray(feed) ? feed : []).slice(0, 3).map((article) => ({
        title: article.headline,
        summary: article.summary,
        url: article.url,
        topic: article.category || article.source || "MARKET",
    }));
}

export function applyTrades(stocks, trades) {
    if (!stocks?.length || !trades?.length) return stocks;

    const bySymbol = new Map(stocks.map((stock) => [stock.symbol, stock]));

    for (const trade of trades) {
        const current = bySymbol.get(trade.s);
        if (!current || !Number.isFinite(Number(trade.p))) continue;
        bySymbol.set(trade.s, mapStockQuote(current, current, trade.p));
    }

    return stocks.map((stock) => bySymbol.get(stock.symbol) || stock);
}
