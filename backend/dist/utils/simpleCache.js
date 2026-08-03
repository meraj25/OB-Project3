"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCache = void 0;
class SimpleCache {
    constructor() {
        this.store = new Map();
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return undefined;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return undefined;
        }
        return entry.value;
    }
    set(key, value, ttlMs) {
        this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    }
    invalidate(key) { this.store.delete(key); }
}
exports.SimpleCache = SimpleCache;
