/**
 * @module WindowManager
 * @description main floating chat window component with settings integration
 */

import { DiscordModules } from "../discord/modules.js"
import { StorageManager } from "../utils/storage.js"
import { ChatContainer } from "./ChatContainer.jsx"
import { SettingsModal } from "./SettingsModal.jsx"

let containerElement = null

export const WindowManager = {
    // inject window into discord app mount root
    init() {
        if (containerElement) return

        const appMount = document.getElementById("app-mount")
        if (!appMount) {
            console.error("[4kryx AI] app mount not found")
            return
        }

        containerElement = document.createElement("div")
        containerElement.id = "fkryx-ai-container"
        appMount.appendChild(containerElement)

        const React = DiscordModules.react
        const ReactDOM = DiscordModules.reactdom

        // render react component tree inside the new container
        if (React && ReactDOM) {
            ReactDOM.render(React.createElement(FloatingWindow, null), containerElement)
        }
    },

    // unmount and remove window from dom safely
    destroy() {
        if (!containerElement) return

        const ReactDOM = DiscordModules.reactdom
        if (ReactDOM) {
            ReactDOM.unmountComponentAtNode(containerElement)
        }
        
        containerElement.remove()
        containerElement = null
    }
}

// core react component for window dragging physics and settings toggle
function FloatingWindow() {
    const React = DiscordModules.react
    
    // load saved positions or fallback to defaults
    const savedPos = StorageManager.get("windowpos")
    const savedSize = StorageManager.get("windowsize")

    const [pos, setPos] = React.useState(savedPos)
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
    
    // local view state management for configuration overlay
    const [showSettings, setShowSettings] = React.useState(false)

    // handle mouse down on window titlebar header
    const handleMouseDown = (e) => {
        // prevent dragging if user clicks on header action buttons
        if (e.target.tagName === "BUTTON") return

        setIsDragging(true)
        setDragStart({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        })
    }

    // track mouse movement globally when dragging is active
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return
            
            const newX = e.clientX - dragStart.x
            const newY = e.clientY - dragStart.y
            
            const newPos = { x: newX, y: newY }
            setPos(newPos)
            StorageManager.set("windowpos", newPos)
        }

        const handleMouseUp = () => {
            if (isDragging) setIsDragging(false)
        }

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, dragStart])

    // inline styling engine using react state combined with custom css
    const windowStyle = {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${savedSize.width}px`,
        height: `${savedSize.height}px`
    }

    return React.createElement(
        "div",
        { className: "fkryx-window", style: windowStyle },
        React.createElement(
            "div",
            { className: "fkryx-header", onMouseDown: handleMouseDown },
            React.createElement("span", { className: "fkryx-title" }, "4kryx AI Assistant"),
            // header action tools control block layout container
            React.createElement(
                "div",
                { style: { display: "flex", gap: "8px", alignItems: "center" } },
                React.createElement("button", {
                    onClick: () => setShowSettings(true),
                    style: { background: "none", border: "none", color: "var(--text-normal)", cursor: "pointer", fontSize: "14px" }
                }, "⚙️"),
                React.createElement("button", { 
                    onClick: () => WindowManager.destroy(),
                    style: { background: "none", border: "none", color: "var(--text-normal)", cursor: "pointer", fontWeight: "bold" }
                }, "X")
            )
        ),
        // render main chat frame interface here
        React.createElement(ChatContainer, null),

        // conditional render check overlay for app options panel modal
        showSettings && React.createElement(SettingsModal, { onClose: () => setShowSettings(false) })
    )
}