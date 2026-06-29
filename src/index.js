/**
 * @name 4kryxAI
 * @author Txzp
 * @description advanced modular ai assistant integrated inside discord using openrouter stream api
 * @version 1.0.0
 * @source https://github.com/Txzp/4kryx-IA
 */

import { StorageManager } from "./utils/storage.js"
import { WindowManager } from "./components/FloatingWindow.jsx"
import { DiscordModules } from "./discord/modules.js"
import { Styles } from "./styles/index.js"

export default class FourKryxAI {
    constructor() {
        // tracking initial execution state status
        this.initialized = false
    }

    // plugin activation hook sequence trigger
    async start() {
        try {
            console.log("[%c4kryx AI%c] boot sequence initiated", "color: #ff4757; font-weight: bold;", "")

            // 1 load discord internal webpack structures
            await DiscordModules.init()

            // 2 load runtime settings configuration database cache
            StorageManager.init()

            // 3 inject layout stylesheet styling elements into view
            Styles.inject()

            this.initialized = true
            console.log("[%c4kryx AI%c] core architecture active", "color: #2ed573; font-weight: bold;", "")
            
            // 4 spawn main interactive floating engine portal UI view window
            WindowManager.init()

        } catch (error) {
            console.error("[4kryx AI] critical failure during startup", error)
            BdApi.UI.showToast("failed to initialize 4kryx AI check console logs", { type: "error" })
        }
    }

    // plugin deactivation cleanup lifecycle routine
    stop() {
        console.log("[%c4kryx AI%c] shutdown routine sequence triggered", "color: #ff4757; font-weight: bold;", "")
        
        // 1 dismantle and clean dom nodes from window manager engine views
        WindowManager.destroy()

        // 2 strip custom embedded plugin styles sheets
        Styles.remove()

        this.initialized = false
    }

    // dynamic page dom observation listener hook
    observer(changes) {
        if (!this.initialized) return
    }
}