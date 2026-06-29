/**
 * @module ChatContainer
 * @description message history list and chat input engine
 */

import { DiscordModules } from "../discord/modules.js"
import { OpenRouterService } from "../api/openrouter.js"
import { StorageManager } from "../utils/storage.js"

export function ChatContainer() {
    const React = DiscordModules.react
    
    // state management for messages and user input text
    const [messages, setMessages] = React.useState(StorageManager.get("chathistory") || [])
    const [inputValue, setInputValue] = React.useState("")
    const [isThinking, setIsThinking] = React.useState(false)

    // reference to auto scroll to bottom on new messages
    const chatEndRef = React.useRef(null)

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages, isThinking])

    // handle send message button or enter key trigger
    const handleSendMessage = async () => {
        const text = inputValue.trim()
        if (!text || isThinking) return

        const userMessage = { role: "user", content: text }
        const updatedMessages = [...messages, userMessage]
        
        setMessages(updatedMessages)
        setInputValue("")
        setIsThinking(true)

        let assistantContent = ""
        const assistantMessagePlaceholder = { role: "assistant", content: "" }
        
        // append empty assistant slot for incoming stream
        setMessages([...updatedMessages, assistantMessagePlaceholder])

        await OpenRouterService.sendMessageStream(
            updatedMessages,
            (chunk) => {
                // on chunk arrived update streaming text view
                assistantContent += chunk
                setMessages([...updatedMessages, { role: "assistant", content: assistantContent }])
            },
            (errorMsg) => {
                // on stream error occurred fallback feedback
                setIsThinking(false)
                BdApi.UI.showToast(errorMsg, { type: "error" })
            },
            () => {
                // on stream completed persist history storage data
                setIsThinking(false)
                const finalHistory = [...updatedMessages, { role: "assistant", content: assistantContent }]
                StorageManager.set("chathistory", finalHistory)
            }
        )
    }

    return React.createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" } },
        // message log frame view block
        React.createElement(
            "div",
            { style: { flex: 1, overflowY: "auto", padding: "8px", maxHeight: "calc(100% - 60px)" } },
            messages.map((msg, index) => 
                React.createElement(
                    "div",
                    { key: index, style: { marginBottom: "12px", alignSelf: msg.role === "user" ? "flex-end" : "flex-start" } },
                    React.createElement(
                        "strong",
                        { style: { color: msg.role === "user" ? "var(--brand-experiment)" : "var(--text-positive)", display: "block" } },
                        msg.role === "user" ? "You" : "4kryx AI"
                    ),
                    React.createElement("span", { style: { color: "var(--text-normal)", whiteSpace: "pre-wrap" } }, msg.content)
                )
            ),
            isThinking && messages[messages.length - 1]?.content === "" && React.createElement(
                "div",
                { style: { color: "var(--text-muted)", fontStyle: "italic" } },
                "AI is typing..."
            ),
            React.createElement("div", { ref: chatEndRef })
        ),
        // bottom form layout frame container block
        React.createElement(
            "div",
            { style: { display: "flex", padding: "8px", gap: "8px", backgroundColor: "var(--background-tertiary)" } },
            React.createElement("input", {
                type: "text",
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleSendMessage(),
                placeholder: "Type a message...",
                style: { flex: 1, background: "var(--background-secondary-alt)", color: "var(--text-normal)", border: "none", padding: "8px", borderRadius: "4px" }
            }),
            React.createElement(
                "button",
                {
                    onClick: handleSendMessage,
                    style: { backgroundColor: "var(--brand-experiment)", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }
                },
                "Send"
            )
        )
    )
}