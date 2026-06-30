import { DiscordModules }    from "../discord/modules.js";
import { StorageManager }    from "../discord/storage.js";
import { AIService }         from "../api/aiService.js";
import { Icon }              from "../utils/icons.js";
import { buildMessagesHtml } from "./MessageItem.jsx";
import { SettingsModal }     from "./SettingsModal.jsx";

export function ChatContainer({ currentView, aiName, aiSystem, activeChatId,
                                settingsDraft, setSettingsDraft, onSaveSettings,
                                hasUnsavedSettings, appliedFontFamily, allChats }) {
  const React          = DiscordModules.react;
  const [messages,     setMessages]     = React.useState([]);
  const [inputValue,   setInputValue]   = React.useState("");
  const [isThinking,   setIsThinking]   = React.useState(false);
  const chatScrollerRef   = React.useRef(null);
  const responseBufferRef = React.useRef("");

  // Carga mensajes al cambiar de chat
  React.useEffect(() => {
    const chats      = StorageManager.get("allChats") || {};
    const current    = chats[activeChatId] || { messages: [] };
    setMessages(current.messages);
    setIsThinking(false);
  }, [activeChatId]);

  // Scroll al fondo
  React.useEffect(() => {
    const end = document.getElementById("fkryx-ai-chat-end");
    if (end) end.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, currentView]);

  // Listener de botones copy/reintentar dentro del HTML
  React.useEffect(() => {
    const container = chatScrollerRef.current;
    if (!container) return;
    const handleClick = e => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      const index  = Number(btn.dataset.index);
      if (action === "copy")  copyMessage(index);
      if (action === "again") retryMessage(index);
    };
    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [messages, isThinking]);

  const emitChatUpdate = (chatId, updatedChat) => {
    window.dispatchEvent(new CustomEvent("fkryx-update-chat", {
      detail: { chatId, chat: updatedChat }
    }));
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isThinking) return;

    const userMsg      = { role: "user", content: text };
    const updated      = [...messages, userMsg];
    setMessages([...updated, { role: "assistant", content: "" }]);
    setInputValue("");
    setIsThinking(true);

    let buffer = "";
    await AIService.sendMessage(updated, aiSystem,
      chunk => {
        buffer += chunk;
        setMessages([...updated, { role: "assistant", content: buffer }]);
      },
      err => {
        setIsThinking(false);
        BdApi.UI.showToast(err, { type: "error" });
      },
      () => {
        setIsThinking(false);
        const final      = [...updated, { role: "assistant", content: buffer }];
        const chat       = { ...allChats[activeChatId], messages: final };
        if (chat.title === "Chat Principal 💬" || chat.title === "Nueva conversación...") {
          chat.title = text.length > 18 ? text.substring(0, 15) + "..." : text;
        }
        emitChatUpdate(activeChatId, chat);
      }
    );
  };

  const clearHistory = () => {
    setMessages([]);
    emitChatUpdate(activeChatId, { ...allChats[activeChatId], messages: [] });
    BdApi.UI.showToast("Conversación vaciada", { type: "info" });
  };

  const getAssistantPos = index => {
    let count = -1;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === "assistant" && messages[i].content.trim() !== "") {
        count++;
        if (count === index) return i;
      }
    }
    return -1;
  };

  const copyMessage = async index => {
    const pos     = getAssistantPos(index);
    const content = messages[pos]?.content || "";
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      BdApi.UI.showToast("Copiado al portapapeles", { type: "success" });
    } catch {
      BdApi.UI.showToast("No se pudo copiar.", { type: "error" });
    }
  };

  const retryMessage = async index => {
    if (isThinking) return;
    const assistantPos = getAssistantPos(index);
    if (assistantPos < 0) return;

    let userPos = -1;
    for (let i = assistantPos - 1; i >= 0; i--) {
      if (messages[i].role === "user") { userPos = i; break; }
    }
    if (userPos < 0) return;

    const base = [...messages.slice(0, userPos + 1), { role: "assistant", content: "" }];
    responseBufferRef.current = "";
    setMessages(base);
    setIsThinking(true);

    await AIService.sendMessage(base, aiSystem,
      chunk => {
        responseBufferRef.current += chunk;
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: responseBufferRef.current }]);
      },
      err => {
        setIsThinking(false);
        BdApi.UI.showToast(err, { type: "error" });
      },
      () => {
        setIsThinking(false);
        const final = [...base.slice(0, -1), { role: "assistant", content: responseBufferRef.current }];
        emitChatUpdate(activeChatId, { ...allChats[activeChatId], messages: final });
      }
    );
  };

  if (currentView === "settings") {
    return React.createElement(SettingsModal, {
      settingsDraft,
      setSettingsDraft,
      onSave:          onSaveSettings,
      hasUnsaved:      hasUnsavedSettings,
      appliedFontFamily
    });
  }

  return React.createElement("div", { className: "fkryx-chat-body" },
    React.createElement("div", {
      className: "fkryx-scroller",
      ref: chatScrollerRef,
      dangerouslySetInnerHTML: {
        __html: buildMessagesHtml(messages, aiName, isThinking)
      }
    }),
    React.createElement("div", { className: "fkryx-input-area" },
      React.createElement("input", {
        type: "text",
        value: inputValue,
        onChange:  e => setInputValue(e.target.value),
        onKeyDown: e => e.key === "Enter" && handleSend(),
        placeholder: `Pregúntale algo a ${aiName}...`,
        className: "fkryx-input-field"
      }),
      React.createElement("button", {
        onClick: handleSend,
        className: "fkryx-send-btn fkryx-button-ripple",
        title: "Enviar"
      }, React.createElement(Icon, { name: "send", size: 18 })),
      React.createElement("button", {
        onClick: clearHistory,
        className: "fkryx-clear-btn fkryx-button-ripple",
        title: "Limpiar Chat"
      }, React.createElement(Icon, { name: "trash2", size: 18 }))
    )
  );
}