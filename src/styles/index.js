/**
 * @module Styles
 * @description css injection system
 */

const PLUGIN_STYLE_ID = "4kryx-ai-styles"

// main styles using standard discord variables
const cssStyles = `
    /* floating window container */
    .fkryx-window {
        position: absolute;
        z-index: 1000;
        background-color: var(--background-secondary);
        border: 1px solid var(--background-modifier-accent);
        border-radius: 8px;
        box-shadow: var(--elevation-stroke), var(--elevation-high);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-width: 300px;
        min-height: 400px;
    }

    /* window header drag area */
    .fkryx-header {
        padding: 10px;
        background-color: var(--background-tertiary);
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    }

    /* main app title */
    .fkryx-title {
        font-weight: 600;
        color: var(--header-primary);
        font-size: 14px;
    }
`

export const Styles = {
    inject() {
        BdApi.DOM.addStyle(PLUGIN_STYLE_ID, cssStyles)
    },
    remove() {
        BdApi.DOM.removeStyle(PLUGIN_STYLE_ID)
    }
}