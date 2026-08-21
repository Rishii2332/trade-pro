const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

function parsePercent(value) {
    return Number.parseFloat(String(value ?? "").replace("%", "")) || 0;
}

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

function formatPercent(value) {
    const pct = parsePercent(value);
    const raw = String(value ?? "").replace("%", "");
    if (!raw) return "--";
    if (raw.startsWith("+") || raw.startsWith("-")) {
        return raw.endsWith("%") ? raw : `${raw}%`;
    }
    return `${pct >= 0 ? "+" : ""}${raw}%`;
}

function mapMover(item) {
    const pct = parsePercent(item.change_percentage);
    return {
        name: item.ticker,
        symbol: item.ticker,
        price: formatMoney(item.price),
        rawPrice: Number(item.price) || 0,
        rawChange: Number(item.change_amount) || 0,
        change: formatSigned(item.change_amount),
        percentage: formatPercent(item.change_percentage),
        value: formatMoney(item.price),
        positive: pct >= 0,
    };
}

async function fetchAlphaVantage(params) {
    if (!API_KEY) {
        throw new Error("Missing VITE_ALPHA_VANTAGE_API_KEY");
    }

    const url = `${BASE_URL}?${new URLSearchParams({
        ...params,
        apikey: API_KEY,
    })}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Failed to fetch market data");
    }

    if (data.Note || data.Information || data["Error Message"]) {
        throw new Error(
            data.Note || data.Information || data["Error Message"]
        );
    }

    return data;
}

export async function getMarketSnapshot() {
    const data = await fetchAlphaVantage({
        function: "TOP_GAINERS_LOSERS",
    });

    const mostActive = (data.most_actively_traded || []).map(mapMover);
    const topGainers = (data.top_gainers || []).map(mapMover);
    const topLosers = (data.top_losers || []).map(mapMover);

    return {
        lastUpdated: data.last_updated || "",
        indices: mostActive.slice(0, 4),
        watchlist: mostActive.slice(0, 5),
        topGainers: topGainers.slice(0, 3),
        topLosers: topLosers.slice(0, 3),
    };
}

export async function getMarketNews() {
    const data = await fetchAlphaVantage({
        function: "NEWS_SENTIMENT",
        topics: "financial_markets",
        limit: "3",
        sort: "LATEST",
    });

    return (data.feed || []).slice(0, 3).map((article) => ({
        title: article.title,
        summary: article.summary,
        url: article.url,
        topic: article.topics?.[0]?.topic || article.source || "MARKET",
    }));
}
