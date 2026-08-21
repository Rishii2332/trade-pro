import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuote } from "../services/marketService";
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
    const [marketData, setMarketData] = useState({});
    const [marketLoading, setMarketLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

    const loadUser = async () => {

        try {

            const currentUser =
                await authService.getCurrentUser();

            console.log(
                "AUTH USER:",
                currentUser
            );

            const details =
                await authService.getUserDetails(
                    currentUser.$id
                );

            console.log(
                "DATABASE USER:",
                details
            );

            setUserDetails(details);

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

            const symbols = [
                "RELIANCE",
                "TCS",
                "INFY",
                "HDFCBANK",
                "TATAMOTORS"
            ];

            const data = await getQuotes(symbols);

            console.log("MARKET DATA:", data);

            setMarketData(data);

        } catch (error) {

            console.error(
                "Market data error:",
                error
            );

        } finally {

            setMarketLoading(false);

        }

    };

    loadMarketData();

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


    // -----------------------------
    // Sample Market Data
    // -----------------------------

    <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">

    <p className="text-gray-400">
        {reliance?.name || "Reliance Industries"}
    </p>

    <h2 className="text-3xl font-bold mt-2">
        ₹{reliance?.close || "--"}
    </h2>

    <p
        className={
            Number(reliance?.percent_change) >= 0
                ? "text-emerald-400 mt-2"
                : "text-red-400 mt-2"
        }
    >
        {reliance?.percent_change
            ? `${reliance.percent_change}%`
            : "--"}
    </p>

</div>

    const marketIndices = [
        {
            name: "NIFTY 50",
            value: "24,876.45",
            change: "+124.35",
            percentage: "+0.50%",
            positive: true,
        },
        {
            name: "SENSEX",
            value: "81,698.25",
            change: "+356.78",
            percentage: "+0.44%",
            positive: true,
        },
        {
            name: "BANK NIFTY",
            value: "55,432.10",
            change: "-123.45",
            percentage: "-0.22%",
            positive: false,
        },
        {
            name: "NIFTY IT",
            value: "41,238.65",
            change: "+298.12",
            percentage: "+0.73%",
            positive: true,
        },
    ];


    const watchlist = [
        {
            name: "Reliance Industries",
            symbol: "RELIANCE",
            price: "1,428.60",
            change: "+1.25%",
            positive: true,
        },
        {
            name: "Tata Motors",
            symbol: "TATAMOTORS",
            price: "734.80",
            change: "+2.18%",
            positive: true,
        },
        {
            name: "Infosys",
            symbol: "INFY",
            price: "1,582.40",
            change: "-0.84%",
            positive: false,
        },
        {
            name: "HDFC Bank",
            symbol: "HDFCBANK",
            price: "1,912.25",
            change: "+0.67%",
            positive: true,
        },
        {
            name: "TCS",
            symbol: "TCS",
            price: "3,421.50",
            change: "-0.42%",
            positive: false,
        },
    ];


    const topGainers = [
        {
            name: "Tata Motors",
            price: "734.80",
            change: "+5.82%",
        },
        {
            name: "Adani Ports",
            price: "1,345.20",
            change: "+4.76%",
        },
        {
            name: "BEL",
            price: "312.45",
            change: "+3.91%",
        },
    ];


    const topLosers = [
        {
            name: "Infosys",
            price: "1,582.40",
            change: "-2.35%",
        },
        {
            name: "Wipro",
            price: "512.80",
            change: "-1.84%",
        },
        {
            name: "ITC",
            price: "462.25",
            change: "-1.42%",
        },
    ];


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

                <div className="max-w-7xl mx-auto px-6 py-3 flex gap-8 overflow-x-auto">

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
                                ₹1,24,580.50
                            </h2>

                        </div>


                        <div className="mt-6 flex gap-8">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Today's P&L
                                </p>

                                <p className="text-emerald-400 font-semibold mt-1">
                                    +₹2,450.25 (+1.99%)
                                </p>

                            </div>


                            <div>

                                <p className="text-gray-500 text-sm">
                                    Overall P&L
                                </p>

                                <p className="text-emerald-400 font-semibold mt-1">
                                    +₹14,580.50 (+13.26%)
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
                            ₹45,820.00
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
                                            Market Overview
                                        </h2>

                                        <button className="text-indigo-400 text-sm">
                                            View All
                                        </button>

                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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
                                            ₹{stock.price}
                                        </p>

                                        <p
                                            className={
                                                stock.positive
                                                    ? "text-emerald-400 text-sm"
                                                    : "text-red-400 text-sm"
                                            }
                                        >
                                            {stock.change}
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
                                            ₹{stock.price}
                                        </p>

                                    </div>

                                    <span className="text-emerald-400">
                                        {stock.change}
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
                                            ₹{stock.price}
                                        </p>

                                    </div>

                                    <span className="text-red-400">
                                        {stock.change}
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

                        <article className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">

                            <span className="text-xs text-indigo-400">
                                MARKET
                            </span>

                            <h3 className="font-semibold text-lg mt-3">
                                Indian markets open higher amid positive global cues
                            </h3>

                            <p className="text-gray-500 text-sm mt-3">
                                Nifty and Sensex started the session with gains as investors tracked global market movements.
                            </p>

                        </article>


                        <article className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">

                            <span className="text-xs text-indigo-400">
                                TECHNOLOGY
                            </span>

                            <h3 className="font-semibold text-lg mt-3">
                                IT stocks remain in focus this week
                            </h3>

                            <p className="text-gray-500 text-sm mt-3">
                                Technology companies remain closely watched as investors evaluate upcoming earnings.
                            </p>

                        </article>


                        <article className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">

                            <span className="text-xs text-indigo-400">
                                INVESTING
                            </span>

                            <h3 className="font-semibold text-lg mt-3">
                                Investors focus on long-term opportunities
                            </h3>

                            <p className="text-gray-500 text-sm mt-3">
                                Market participants continue to monitor valuations and long-term growth opportunities.
                            </p>

                        </article>

                    </div>

                </section>

            </main>

        </div>

    );

}

export default Home;