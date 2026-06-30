import { PLUGIN_NAME } from "../config.js";

const MAIN_STYLE_ID     = `${PLUGIN_NAME}-styles`;
const RESPONSE_STYLE_ID = `${PLUGIN_NAME}-response-styles`;

const mainCss = `
  /* pega aquí el valor completo de cssStyles del plugin original */
`;

const responseCss = `
  /* pega aquí el CSS que estaba dentro de injectAIResponseStyles() */
`;

export const Styles = {
  inject() {
    BdApi.DOM.addStyle(MAIN_STYLE_ID,     mainCss);
    BdApi.DOM.addStyle(RESPONSE_STYLE_ID, responseCss);
  },
  remove() {
    BdApi.DOM.removeStyle(MAIN_STYLE_ID);
    BdApi.DOM.removeStyle(RESPONSE_STYLE_ID);
  }
};