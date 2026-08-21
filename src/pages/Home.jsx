import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    applyTrades,
    getFinnhubNews,
    getFinnhubQuotes,
} from "../services/finnhubService";
import { finnhubSocket } from "../services/finnhubSocket";
import {
    FaChartLine,
    FaSearch,
    FaStar,
    FaRegStar,
    FaArrowUp,
    FaArrowDown,
    FaWallet,
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaPlus,
    FaMinus,
} from "react-icons/fa";

import authService from "../appwrite/authService";

function Home() {

    const navigate = useNavigate();

    // -----------------------------
    // Carousel
    // -----------------------------
    const [marketLoading, setMarketLoading] = useState(true);
    const [marketError, setMarketError] = useState("");
    const [marketIndices, setMarketIndices] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [topGainers, setTopGainers] = useState([]);
    const [topLosers, setTopLosers] = useState([]);
    const [news, setNews] = useState([]);
    const [socketLive, setSocketLive] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

    const loadUser = async () => {

        try {

            const currentUser =
                await authService.getCurrentUser();

            setUser(currentUser);

            console.log(
                "AUTH USER:",
                currentUser
            );

            const details =
                await authService.getUserDetails(
                    currentUser.$id,
                    currentUser.email
                );

            console.log(
                "DATABASE USER:",
                details
            );

            setUserDetails(
                details || {
                    fullName: currentUser.name,
                    membershipStatus: "active",
                }
            );

        } catch (error) {

            console.error(
                "USER LOAD ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    loadUser();

}, []);

    useEffect(() => {

    const loadMarketData = async () => {

        try {

            setMarketError("");

            const snapshot = await getFinnhubQuotes();

            setMarketIndices(snapshot.indices);
            setWatchlist(snapshot.watchlist);
            setTopGainers(snapshot.topGainers);
            setTopLosers(snapshot.topLosers);

            try {
                const articles = await getFinnhubNews();
                setNews(articles);
            } catch (newsError) {
                console.error("Market news error:", newsError);
            }

        } catch (error) {

            console.error(
                "Market data error:",
                error
            );
            setMarketError(error.message || "Failed to load live market data");

        } finally {

            setMarketLoading(false);

        }

    };

    loadMarketData();

    const stopSocket = finnhubSocket.start((trades) => {
        setSocketLive(true);
        setWatchlist((current) => applyTrades(current, trades));
        setMarketIndices((current) => applyTrades(current, trades));
        setTopGainers((current) => applyTrades(current, trades));
        setTopLosers((current) => applyTrades(current, trades));
    });

    return () => {
        stopSocket();
        setSocketLive(false);
    };

}, []);
    const slides = [
        {
            title: "Trade Smarter",
            description:
                "Track markets, analyze stocks and build your portfolio with confidence.",
            button: "Explore Markets",
        },
        {
            title: "Build Your Portfolio",
            description:
                "Invest in stocks and keep track of your investments in one place.",
            button: "View Portfolio",
        },
        {
            title: "Stay Ahead of the Market",
            description:
                "Follow market movements and discover today's biggest opportunities.",
            button: "View Watchlist",
        },
    ];

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentSlide((prev) =>
                (prev + 1) % slides.length
            );

        }, 4000);

        return () => clearInterval(timer);

    }, [slides.length]);


    // -----------------------------
    // Logout
    // -----------------------------

    const logout = async () => {

        try {

            await authService.logout();

            navigate("/");

        } catch (error) {

            console.error(error);

        }

    };

    if (loading) {

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center">

            <div className="text-center">

                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto">
                </div>

                <p className="text-gray-400 mt-4">
                    Loading dashboard...
                </p>

            </div>

        </div>

    );

}

    const sharesPerStock = 10;
    const portfolioValue = watchlist.reduce(
        (sum, stock) => sum + stock.rawPrice * sharesPerStock,
        0
    );
    const todayPnl = watchlist.reduce(
        (sum, stock) => sum + stock.rawChange * sharesPerStock,
        0
    );
    const todayPnlPercent = portfolioValue
        ? (todayPnl / (portfolioValue - todayPnl)) * 100
        : 0;
    const availableBalance = portfolioValue * 0.3;

    const formatUsd = (value) =>
        Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

            <nav className="border-b border-white/10 bg-slate-950/95 backdrop-blur-lg sticky top-0 z-50">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo */}

                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate("/home")}
                    >

                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">

                            <FaChartLine className="text-xl" />

                        </div>

                        <div>

                            <h1 className="text-xl font-bold">
                                TradeBro
                            </h1>

                            <p className="text-xs text-gray-500">
                                Smart Trading
                            </p>

                        </div>

                    </div>


                    {/* Search */}

                    <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-80">

                        <FaSearch className="text-gray-500 mr-3" />

                        <input
                            type="text"
                            placeholder="Search stocks..."
                            className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500"
                        />

                    </div>


                    {/* Right Side */}

                    <div className="flex items-center gap-5">

                        <button className="text-gray-400 hover:text-white">

                            <FaBell />

                        </button>

                        <div className="hidden sm:flex items-center gap-2">

                            <FaUserCircle className="text-2xl text-indigo-400" />

                            <span className="text-sm">
                                {userDetails?.fullName || "Trader"}
                            </span>

                        </div>

                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-red-400 transition"
                            title="Logout"
                        >

                            <FaSignOutAlt />

                        </button>

                    </div>

                </div>

            </nav>


            {/* ================================= */}
            {/* MARKET TICKER */}
            {/* ================================= */}

            <div className="border-b border-white/10 bg-black/20">

                {marketError && (
                    <p className="max-w-7xl mx-auto px-6 py-2 text-sm text-red-400">
                        {marketError}
                    </p>
                )}

                <div className="max-w-7xl mx-auto px-6 py-3 flex gap-8 overflow-x-auto">

                    <span className={`text-xs font-semibold whitespace-nowrap ${socketLive ? "text-emerald-400" : "text-gray-500"}`}>
                        {socketLive ? "LIVE" : "CONNECTING"}
                    </span>

                    {marketLoading && (
                        <span className="text-sm text-gray-400">
                            Loading Finnhub quotes...
                        </span>
                    )}

                    {marketIndices.map((market) => (

                        <div
                            key={market.name}
                            className="flex items-center gap-3 whitespace-nowrap"
                        >

                            <span className="text-sm text-gray-400">
                                {market.name}
                            </span>

                            <span className="font-semibold">
                                {market.value}
                            </span>

                            <span
                                className={
                                    market.positive
                                        ? "text-emerald-400 text-sm"
                                        : "text-red-400 text-sm"
                                }
                            >
                                {market.percentage}
                            </span>

                        </div>

                    ))}

                </div>

            </div>


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main className="max-w-7xl mx-auto px-6 py-8">


                {/* ================================= */}
                {/* CAROUSEL */}
                {/* ================================= */}

                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-white/10">

                    <div className="min-h-[300px] flex items-center px-8 md:px-16">

                        <div className="max-w-2xl">

                            <p className="text-indigo-300 font-semibold mb-3">
                                TRADEBRO PLATFORM
                            </p>

                            <h2 className="text-4xl md:text-5xl font-bold mb-5">

                                {slides[currentSlide].title}

                            </h2>

                            <p className="text-gray-300 text-lg mb-7">

                                {slides[currentSlide].description}

                            </p>

                            <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">

                                {slides[currentSlide].button}

                            </button>

                        </div>

                    </div>


                    {/* Slide indicators */}

                    <div className="absolute bottom-6 left-8 flex gap-2">

                        {slides.map((_, index) => (

                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={
                                    index === currentSlide
                                        ? "w-8 h-2 rounded-full bg-white"
                                        : "w-2 h-2 rounded-full bg-white/30"
                                }
                            />

                        ))}

                    </div>

                </section>


                {/* ================================= */}
                {/* PORTFOLIO */}
                {/* ================================= */}


                <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Welcome + Portfolio */}

                    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">

                        {/* USER WELCOME */}

                        <p className="text-gray-400 text-sm">
                            Welcome back
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {userDetails?.fullName || "Trader"} 👋
                        </h2>


                        {/* Portfolio Information */}

                        <div className="mt-6">

                            <p className="text-gray-400 text-sm">
                                Total Portfolio Value
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                ${formatUsd(portfolioValue)}
                            </h2>

                        </div>


                        <div className="mt-6 flex gap-8">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Today's P&L
                                </p>

                                <p className={`${todayPnl >= 0 ? "text-emerald-400" : "text-red-400"} font-semibold mt-1`}>
                                    {todayPnl >= 0 ? "+" : "-"}${formatUsd(Math.abs(todayPnl))} ({todayPnlPercent >= 0 ? "+" : ""}{todayPnlPercent.toFixed(2)}%)
                                </p>

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Live holdings
                                </p>

                                <p className="text-gray-300 font-semibold mt-1">
                                    10 shares × {watchlist.length || 0} active tickers
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Available Balance */}

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                        <p className="text-gray-400 text-sm">
                            Available Balance
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ${formatUsd(availableBalance)}
                        </h2>

                        <button className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold">

                            Add Funds

                        </button>

                        {/* Membership */}

                        <div className="mt-5">

                            <span className="text-gray-400 text-sm">
                                Membership
                            </span>

                            <p className="text-emerald-400 font-semibold capitalize">
                                {userDetails?.membershipStatus || "active"}
                            </p>

                        </div>

                    </div>

                </section>


                                {/* ================================= */}
                                {/* MARKET INDICES */}
                                {/* ================================= */}

                                <section className="mt-10">

                                    <div className="flex justify-between items-center mb-5">

                                        <h2 className="text-2xl font-bold">
                                            Live US stocks
                                        </h2>

                                        <button className="text-indigo-400 text-sm">
                                            View All
                                        </button>

                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                        {!marketLoading && marketIndices.length === 0 && (
                                            <p className="text-gray-500">
                                                Live quotes unavailable right now.
                                            </p>
                                        )}

                                        {marketIndices.map((market) => (

                                            <div
                                                key={market.name}
                                                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition"
                                            >

                                                <p className="text-gray-400 text-sm">
                                                    {market.name}
                                                </p>

                                                <h3 className="text-xl font-bold mt-2">
                                                    {market.value}
                                                </h3>

                                                <div
                                                    className={
                                                        "flex items-center gap-2 mt-2 " +
                                                        (market.positive
                                                            ? "text-emerald-400"
                                                            : "text-red-400")
                                                    }
                                                >

                                                    {market.positive
                                                        ? <FaArrowUp />
                                                        : <FaArrowDown />
                                                    }

                                                    <span>
                                                        {market.change}
                                                    </span>

                                                    <span>
                                                        ({market.percentage})
                                                    </span>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </section>


                {/* ================================= */}
                {/* WATCHLIST + MOVERS */}
                {/* ================================= */}

                <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">


                    {/* Watchlist */}

                    <div className="lg:col-span-2">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-2xl font-bold">
                                My Watchlist
                            </h2>

                            <button className="text-indigo-400 text-sm">
                                View All
                            </button>

                        </div>


                        <div className="rounded-2xl border border-white/10 overflow-hidden">

                            {marketLoading && (
                                <p className="p-5 text-gray-500">
                                    Fetching live quotes...
                                </p>
                            )}

                            {watchlist.map((stock) => (

                                <div
                                    key={stock.symbol}
                                    className="flex items-center justify-between p-5 border-b border-white/10 hover:bg-white/5 transition"
                                >

                                    <div className="flex items-center gap-4">

                                        <FaRegStar className="text-gray-500 hover:text-yellow-400 cursor-pointer" />

                                        <div>

                                            <p className="font-semibold">
                                                {stock.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {stock.symbol}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="text-right">

                                        <p className="font-semibold">
                                            ${stock.price}
                                        </p>

                                        <p
                                            className={
                                                stock.positive
                                                    ? "text-emerald-400 text-sm"
                                                    : "text-red-400 text-sm"
                                            }
                                        >
                                            {stock.percentage}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* Top Gainers */}

                    <div>

                        <h2 className="text-2xl font-bold mb-5">
                            Market Movers
                        </h2>


                        <div className="rounded-2xl border border-white/10 p-5">

                            <h3 className="text-emerald-400 font-semibold mb-4">
                                Top Gainers
                            </h3>

                            {marketLoading && (
                                <p className="text-gray-500 mb-4">
                                    Fetching movers...
                                </p>
                            )}

                            {topGainers.map((stock) => (

                                <div
                                    key={stock.name}
                                    className="flex justify-between py-4 border-b border-white/10"
                                >

                                    <div>

                                        <p className="font-medium">
                                            {stock.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            ${stock.price}
                                        </p>

                                    </div>

                                    <span className="text-emerald-400">
                                        {stock.percentage}
                                    </span>

                                </div>

                            ))}


                            <h3 className="text-red-400 font-semibold mt-6 mb-2">
                                Top Losers
                            </h3>

                            {topLosers.map((stock) => (

                                <div
                                    key={stock.name}
                                    className="flex justify-between py-4 border-b border-white/10"
                                >

                                    <div>

                                        <p className="font-medium">
                                            {stock.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            ${stock.price}
                                        </p>

                                    </div>

                                    <span className="text-red-400">
                                        {stock.percentage}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* ================================= */}
                {/* QUICK ACTIONS */}
                {/* ================================= */}

                <section className="mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <button className="p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition text-left">

                            <FaPlus className="mb-4" />

                            <p className="font-semibold">
                                Buy Stock
                            </p>

                        </button>


                        <button className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">

                            <FaMinus className="mb-4 text-red-400" />

                            <p className="font-semibold">
                                Sell Stock
                            </p>

                        </button>


                        <button className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">

                            <FaStar className="mb-4 text-yellow-400" />

                            <p className="font-semibold">
                                Watchlist
                            </p>

                        </button>


                        <button className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">

                            <FaChartLine className="mb-4 text-indigo-400" />

                            <p className="font-semibold">
                                Analyze Market
                            </p>

                        </button>

                    </div>

                </section>


                {/* ================================= */}
                {/* NEWS */}
                {/* ================================= */}

                <section className="mt-10 pb-12">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-2xl font-bold">
                            Market News
                        </h2>

                        <button className="text-indigo-400 text-sm">
                            View All
                        </button>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {news.length === 0 && (
                            <p className="text-gray-500">
                                Live headlines will appear here when Alpha Vantage news is available.
                            </p>
                        )}

                        {news.map((article) => (

                        <a
                            key={article.url}
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
                        >

                            <span className="text-xs text-indigo-400 uppercase">
                                {article.topic}
                            </span>

                            <h3 className="font-semibold text-lg mt-3">
                                {article.title}
                            </h3>

                            <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                                {article.summary}
                            </p>

                        </a>

                        ))}

                    </div>

                </section>

            </main>

        </div>

    );

}

export default Home;