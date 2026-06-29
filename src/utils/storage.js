/**
 * @module StorageManager
 * @description native betterdiscord data management
 */

const PLUGIN_NAME = "4kryxAI"

// default configuration state
const defaultSettings = {
    openroutertoken: "",
    selectedmodel: "anthropic/claude-3-haiku",
    windowpos: { x: 100, y: 100 },
    windowsize: { width: 400, height: 500 },
    chathistory: []
}

export const StorageManager = {
    cache: {},

    // load all data into memory cache
    init() {
        try {
            const savedData = BdApi.Data.load(PLUGIN_NAME, "settings")
            this.cache = savedData ? { ...defaultSettings, ...savedData } : { ...defaultSettings }
            console.log("[4kryx AI] storage initialized")
        } catch (error) {
            console.error("[4kryx AI] failed to load storage", error)
            this.cache = { ...defaultSettings }
        }
    },

    // get specific key from cache
    get(key) {
        return this.cache[key]
    },

    // update key in cache and persist to disk
    set(key, value) {
        this.cache[key] = value
        try {
            BdApi.Data.save(PLUGIN_NAME, "settings", this.cache)
        } catch (error) {
            console.error("[4kryx AI] failed to save data key", error)
        }
    },

    // clear all saved data and reset cache
    clear() {
        this.cache = { ...defaultSettings }
        try {
            BdApi.Data.save(PLUGIN_NAME, "settings", this.cache)
        } catch (error) {
            console.error("[4kryx AI] failed to clear storage", error)
        }
    }
}