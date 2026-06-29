/**
 * @module DiscordModules
 * @description discord webpack module abstraction
 */

export const DiscordModules = {
    react: null,
    reactdom: null,
    dispatcher: null,
    channelstore: null,
    selectedchannelstore: null,

    async init() {
        try {
            // bdapi core hooks
            this.react = BdApi.React
            this.reactdom = BdApi.ReactDOM

            // find internal discord modules using webpack filters
            this.dispatcher = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("dispatch", "subscribe"))
            this.channelstore = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getChannel", "getChannels"))
            this.selectedchannelstore = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getChannelId", "getVoiceChannelId"))

            console.log("[4kryx AI] discord modules loaded")
        } catch (error) {
            console.error("[4kryx AI] failed to map webpack modules", error)
            throw error
        }
    }
}