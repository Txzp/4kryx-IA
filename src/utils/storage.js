import { PLUGIN_NAME, defaultSettings } from "../config.js";

export const StorageManager = {
  cache: {},

  init() {
    try {
      const saved = BdApi.Data.load(PLUGIN_NAME, "settings");
      this.cache = saved ? { ...defaultSettings, ...saved } : { ...defaultSettings };
      if (!this.cache.allChats || Object.keys(this.cache.allChats).length === 0) {
        this.cache.allChats     = { ...defaultSettings.allChats };
        this.cache.activeChatId = "default";
      }
      console.log("[4kryx AI] storage initialized");
    } catch (error) {
      console.error("[4kryx AI] failed to load storage", error);
      this.cache = { ...defaultSettings };
    }
  },

  get(key)        { return this.cache[key]; },

  set(key, value) {
    this.cache[key] = value;
    try {
      BdApi.Data.save(PLUGIN_NAME, "settings", this.cache);
    } catch (error) {
      console.error("[4kryx AI] failed to save key:", key, error);
    }
  }
};