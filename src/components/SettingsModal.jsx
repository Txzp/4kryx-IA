/**
 * @module SettingsModal
 * @description api credentials and model selection panel
 */

import { DiscordModules } from "../discord/modules.js"
import { StorageManager } from "../utils/storage.js"

export function SettingsModal({ onClose }) {
    const React = DiscordModules.react

    // local state management synced with persistent cache storage
    const [token, setToken] = React.useState(StorageManager.get("openroutertoken") || "")
    const [model, setModel] = React.useState(StorageManager.get("selectedmodel") || "anthropic/claude-3-haiku")

    // save action handling logic
    const handleSave = () => {
        StorageManager.set("openroutertoken", token.trim())
        StorageManager.set("selectedmodel", model)
        BdApi.UI.showToast("settings updated successfully", { type: "success" })
        if (onClose) onClose()
    }

    return React.createElement(
        "div",
        { 
            style: { 
                position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
                backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", 
                justifyContent: "center", zIndex: 3000 
            } 
        },
        React.createElement(
            "div",
            { 
                style: { 
                    backgroundColor: "var(--background-secondary)", padding: "24px", 
                    borderRadius: "8px", width: "400px", boxShadow: "var(--elevation-high)",
                    display: "flex", flexDirection: "column", gap: "16px" 
                } 
            },
            // header label configuration title block
            React.createElement("h2", { style: { color: "var(--header-primary)", margin: 0 } }, "4kryx AI Settings"),
            
            // openrouter token input block layout
            React.createElement(
                "div",
                null,
                React.createElement("label", { style: { color: "var(--text-normal)", display: "block", marginBottom: "8px" } }, "OpenRouter API Key"),
                React.createElement("input", {
                    type: "password",
                    value: token,
                    onChange: (e) => setToken(e.target.value),
                    placeholder: "sk-or-...",
                    style: { width: "100%", padding: "8px", background: "var(--background-tertiary)", color: "var(--text-normal)", border: "none", borderRadius: "4px", boxSizing: "border-box" }
                })
            ),

            // model dropdown select list option layout item
            React.createElement(
                "div",
                null,
                React.createElement("label", { style: { color: "var(--text-normal)", display: "block", marginBottom: "8px" } }, "AI Model Selection"),
                React.createElement(
                    "select",
                    {
                        value: model,
                        onChange: (e) => setModel(e.target.value),
                        style: { width: "100%", padding: "8px", background: "var(--background-tertiary)", color: "var(--text-normal)", border: "none", borderRadius: "4px", boxSizing: "border-box" }
                    },
                    React.createElement("option", { value: "anthropic/claude-3-haiku" }, "Claude 3 Haiku (Fast)"),
                    React.createElement("option", { value: "meta-llama/llama-3-8b-instruct" }, "Llama 3 8B (Smart)"),
                    React.createElement("option", { value: "openai/gpt-4o-mini" }, "GPT-4o Mini (Balanced)")
                )
            ),

            // footer action buttons frame control layout
            React.createElement(
                "div",
                { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" } },
                React.createElement(
                    "button",
                    { 
                        onClick: onClose,
                        style: { background: "none", color: "var(--text-normal)", border: "none", cursor: "pointer", padding: "8px 16px" }
                    }, 
                    "Cancel"
                ),
                React.createElement(
                    "button",
                    { 
                        onClick: handleSave,
                        style: { backgroundColor: "var(--brand-experiment)", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }
                    }, 
                    "Save Settings"
                )
            )
        )
    )
}