export const DiscordModules = {
  react:    null,
  reactdom: null,

  async init() {
    try {
      this.react    = BdApi.React;
      this.reactdom = BdApi.ReactDOM;
      console.log("[4kryx AI] discord modules loaded");
    } catch (error) {
      console.error("[4kryx AI] failed to map webpack modules", error);
      throw error;
    }
  }
};