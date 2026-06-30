/**
 * @name 4kryxAI
 * @author Txzp
 * @description advanced modular ai assistant integrated inside discord - 100% FREE & No Key Required
 * @version 1.7.0
 * @source https://github.com/Txzp/4kryx-IA
 */

import { DiscordModules } from "./discord/modules.js";
import { StorageManager } from "./discord/storage.js";
import { WindowManager }  from "./discord/windowManager.js";
import { Styles }         from "./styles/index.js";

class FourKryxAI {
  constructor() { this.initialized = false; }

  async start() {
    try {
      await DiscordModules.init();
      StorageManager.init();
      Styles.inject();
      this.initialized = true;

      this._onKeyDown = e => {
        if (e.ctrlKey && e.key.toLowerCase() === "l") {
          e.preventDefault();
          document.getElementById("fkryx-ai-container")
            ? WindowManager.destroy(true)
            : WindowManager.init(true);
        }
      };
      window.addEventListener("keydown", this._onKeyDown);
      WindowManager.init();
    } catch (error) {
      console.error("[4kryx AI] critical failure during startup", error);
    }
  }

  stop() {
    WindowManager.destroy(true);
    Styles.remove();
    window.removeEventListener("keydown", this._onKeyDown);
    this.initialized = false;
  }
}

module.exports = FourKryxAI;