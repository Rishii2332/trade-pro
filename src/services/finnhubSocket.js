import { FINNHUB_SYMBOLS } from "./finnhubService";

const SOCKET_URL = () =>
    `wss://ws.finnhub.io?token=${import.meta.env.VITE_FINNHUB_API_KEY}`;

class FinnhubSocket {
    constructor() {
        this.ws = null;
        this.listeners = new Set();
        this.refCount = 0;
        this.reconnectTimer = null;
        this.shouldReconnect = false;
        this.symbols = FINNHUB_SYMBOLS;
    }

    start(onTrades) {
        if (onTrades) this.listeners.add(onTrades);
        this.refCount += 1;
        this.shouldReconnect = true;

        if (this.refCount === 1) {
            this.connect();
        }

        return () => this.stop(onTrades);
    }

    stop(onTrades) {
        if (onTrades) this.listeners.delete(onTrades);
        this.refCount = Math.max(0, this.refCount - 1);

        if (this.refCount === 0) {
            this.shouldReconnect = false;
            this.close();
        }
    }

    connect() {
        if (
            this.ws &&
            (this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        const token = import.meta.env.VITE_FINNHUB_API_KEY;
        if (!token) return;

        this.ws = new WebSocket(SOCKET_URL());

        this.ws.addEventListener("open", () => {
            this.symbols.forEach((symbol) => {
                this.ws.send(
                    JSON.stringify({ type: "subscribe", symbol })
                );
            });
        });

        this.ws.addEventListener("message", (event) => {
            let message;
            try {
                message = JSON.parse(event.data);
            } catch {
                return;
            }

            if (message.type === "ping") {
                this.ws?.send(JSON.stringify({ type: "pong" }));
                return;
            }

            if (message.type === "trade" && Array.isArray(message.data)) {
                this.listeners.forEach((listener) => listener(message.data));
            }
        });

        this.ws.addEventListener("close", () => {
            this.ws = null;
            if (!this.shouldReconnect) return;
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => this.connect(), 2000);
        });
    }

    close() {
        clearTimeout(this.reconnectTimer);
        if (!this.ws) return;

        if (this.ws.readyState === WebSocket.OPEN) {
            this.symbols.forEach((symbol) => {
                this.ws.send(
                    JSON.stringify({ type: "unsubscribe", symbol })
                );
            });
        }

        this.ws.close();
        this.ws = null;
    }
}

export const finnhubSocket = new FinnhubSocket();
