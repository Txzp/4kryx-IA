import { DiscordModules }              from "./modules.js";
import { FloatingWindow, setWindowManager } from "../components/FloatingWindow.jsx";

let containerElement  = null;
let reactRootInstance = null;
let pendingCloseTimer = null;

export const WindowManager = {
  init(animate = false) {
    if (containerElement) return;
    const appMount = document.getElementById("app-mount");
    if (!appMount) return;

    setWindowManager(this);

    containerElement = document.createElement("div");
    containerElement.id = "fkryx-ai-container";
    if (animate) containerElement.classList.add("fkryx-container-open");
    appMount.appendChild(containerElement);

    const React    = DiscordModules.react;
    const ReactDOM = DiscordModules.reactdom;
    try {
      if (ReactDOM?.createRoot) {
        reactRootInstance = ReactDOM.createRoot(containerElement);
        reactRootInstance.render(React.createElement(FloatingWindow, null));
      } else {
        ReactDOM.render(React.createElement(FloatingWindow, null), containerElement);
      }
    } catch (e) {
      console.error("[4kryx AI] bootstrap fallback applied", e);
    }
  },

  destroy(animate = false) {
    if (!containerElement) return;
    if (pendingCloseTimer) { clearTimeout(pendingCloseTimer); pendingCloseTimer = null; }
    const el = containerElement;
    if (animate) {
      el.classList.add("fkryx-container-closing");
      el.querySelector(".fkryx-window")?.classList.add("fkryx-window-closing");
      pendingCloseTimer = setTimeout(() => {
        reactRootInstance?.unmount?.();
        el.parentNode && el.remove();
        containerElement = reactRootInstance = pendingCloseTimer = null;
      }, 220);
      return;
    }
    reactRootInstance?.unmount?.();
    el.remove();
    containerElement = reactRootInstance = null;
  }
};