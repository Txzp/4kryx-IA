import { DiscordModules } from "../discord/modules.js";
import { StorageManager } from "../discord/storage.js";
import { hexToRgba }      from "../utils/color.js";
import { Icon }           from "../utils/icons.js";
import { ChatContainer }  from "./ChatContainer.jsx";
import { Sidebar }        from "./Sidebar.jsx";

// windowManager se importa inline para evitar circular
let _WindowManager = null;
export function setWindowManager(wm) { _WindowManager = wm; }

export function FloatingWindow() {
  const React = DiscordModules.react;

  const posRef  = React.useRef(StorageManager.get("windowpos"));
  const sizeRef = React.useRef(StorageManager.get("windowsize"));
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const [view,           setView]           = React.useState("chat");
  const [isSidebarOpen,  setIsSidebarOpen]  = React.useState(false);
  const [activeChatId,   setActiveChatId]   = React.useState(StorageManager.get("activeChatId") || "default");
  const [allChats,       setAllChats]       = React.useState(StorageManager.get("allChats") || {});
  const [deleteConfirm,  setDeleteConfirm]  = React.useState(null);
  const [renameInfo,     setRenameInfo]     = React.useState(null);

  const s = key => StorageManager.get(key);
  const [appliedAiName,           setAppliedAiName]           = React.useState(s("aiName")           || "4kryx AI");
  const [appliedAiSystem,         setAppliedAiSystem]         = React.useState(s("aiSystemPrompt")   || "");
  const [appliedTextColor,        setAppliedTextColor]        = React.useState(s("textColor")        || "#dcddde");
  const [appliedFontFamily,       setAppliedFontFamily]       = React.useState(s("fontFamily")       || "Whitney, Segoe UI, Arial, sans-serif");
  const [appliedFontWeight,       setAppliedFontWeight]       = React.useState(s("fontWeight")       || 400);
  const [appliedFontSize,         setAppliedFontSize]         = React.useState(s("fontSize")         || 14);
  const [appliedBackgroundColor,  setAppliedBackgroundColor]  = React.useState(s("backgroundColor")  || "#202225");
  const [appliedBackgroundOpacity,setAppliedBackgroundOpacity]= React.useState(s("backgroundOpacity")|| 80);
  const [appliedThemePreset,      setAppliedThemePreset]      = React.useState(s("themePreset")      || "dark");

  const [settingsDraft, setSettingsDraft] = React.useState({
    aiName:            s("aiName")            || "4kryx AI",
    aiSystem:          s("aiSystemPrompt")    || "",
    textColor:         s("textColor")         || "#dcddde",
    fontFamily:        s("fontFamily")        || "Whitney, Segoe UI, Arial, sans-serif",
    fontWeight:        s("fontWeight")        || 400,
    fontSize:          s("fontSize")          || 14,
    backgroundColor:   s("backgroundColor")  || "#202225",
    backgroundOpacity: s("backgroundOpacity") || 80,
    themePreset:       s("themePreset")       || "dark"
  });

  const windowRef      = React.useRef(null);
  const dragStartRef   = React.useRef({ x: 0, y: 0 });
  const resizeStartRef = React.useRef({ w: 0, h: 0, x: 0, y: 0 });
  const isDraggingRef  = React.useRef(false);
  const isResizingRef  = React.useRef(false);
  const rafRef         = React.useRef(null);

  // Escucha updates de chat desde ChatContainer
  React.useEffect(() => {
    const handler = e => {
      const { chatId, chat } = e.detail;
      const next = { ...allChats, [chatId]: chat };
      setAllChats(next);
      StorageManager.set("allChats", next);
    };
    window.addEventListener("fkryx-update-chat", handler);
    return () => window.removeEventListener("fkryx-update-chat", handler);
  }, [allChats]);

  // Drag & resize
  const handleMouseDown = e => {
    if (e.target.closest("button, input, textarea, select, .fkryx-resizable-handle")) return;
    isDraggingRef.current = true;
    dragStartRef.current  = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
  };

  const handleResizeMouseDown = e => {
    e.preventDefault();
    isResizingRef.current = true;
    resizeStartRef.current = { w: sizeRef.current.width, h: sizeRef.current.height, x: e.clientX, y: e.clientY };
  };

  React.useEffect(() => {
    const onMove = e => {
      if (!isDraggingRef.current && !isResizingRef.current) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        if (isDraggingRef.current) {
          posRef.current = { x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y };
          if (windowRef.current) {
            windowRef.current.style.left = `${posRef.current.x}px`;
            windowRef.current.style.top  = `${posRef.current.y}px`;
          }
        }
        if (isResizingRef.current) {
          const w = Math.max(300, resizeStartRef.current.w + (e.clientX - resizeStartRef.current.x));
          const h = Math.max(400, resizeStartRef.current.h + (e.clientY - resizeStartRef.current.y));
          sizeRef.current = { width: w, height: h };
          if (windowRef.current) {
            windowRef.current.style.width  = `${isSidebarOpen ? w + 180 : w}px`;
            windowRef.current.style.height = `${h}px`;
          }
        }
        rafRef.current = null;
      });
    };
    const onUp = () => {
      if (isDraggingRef.current)  { StorageManager.set("windowpos",  posRef.current);  isDraggingRef.current  = false; forceUpdate(); }
      if (isResizingRef.current)  { StorageManager.set("windowsize", sizeRef.current); isResizingRef.current  = false; forceUpdate(); }
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isSidebarOpen]);

  const updateChats = next => { setAllChats(next); StorageManager.set("allChats", next); };

  const handleCreateNewChat = () => {
    const id   = "chat_" + Date.now();
    const next = { ...allChats, [id]: { id, title: "Nueva conversación...", messages: [] } };
    updateChats(next);
    setActiveChatId(id);
    StorageManager.set("activeChatId", id);
    BdApi.UI.showToast("Nueva conversación creada", { type: "success" });
  };

  const handleSelectChat = id => { setActiveChatId(id); StorageManager.set("activeChatId", id); };

  const handleDeleteChat = () => {
    if (!deleteConfirm) return;
    const next = { ...allChats };
    delete next[deleteConfirm.id];
    if (Object.keys(next).length === 0) next.default = { id: "default", title: "Chat Principal", messages: [] };
    const nextActive = activeChatId === deleteConfirm.id ? Object.keys(next)[0] : activeChatId;
    setActiveChatId(nextActive);
    StorageManager.set("activeChatId", nextActive);
    updateChats(next);
    setDeleteConfirm(null);
    BdApi.UI.showToast("Chat eliminado", { type: "success" });
  };

  const handleRenameChat = () => {
    if (!renameInfo) return;
    const next = { ...allChats, [renameInfo.id]: { ...allChats[renameInfo.id], title: renameInfo.value.trim() || "Chat sin nombre" } };
    updateChats(next);
    setRenameInfo(null);
    BdApi.UI.showToast("Chat renombrado", { type: "success" });
  };

  const handleSaveSettings = () => {
    const d = settingsDraft;
    setAppliedAiName(d.aiName);
    setAppliedAiSystem(d.aiSystem);
    setAppliedTextColor(d.textColor);
    setAppliedFontFamily(d.fontFamily);
    setAppliedFontWeight(d.fontWeight);
    setAppliedFontSize(d.fontSize);
    setAppliedBackgroundColor(d.backgroundColor);
    setAppliedBackgroundOpacity(d.backgroundOpacity);
    setAppliedThemePreset(d.themePreset);
    StorageManager.set("aiName",            d.aiName);
    StorageManager.set("aiSystemPrompt",    d.aiSystem);
    StorageManager.set("textColor",         d.textColor);
    StorageManager.set("fontFamily",        d.fontFamily);
    StorageManager.set("fontWeight",        d.fontWeight);
    StorageManager.set("fontSize",          d.fontSize);
    StorageManager.set("backgroundColor",   d.backgroundColor);
    StorageManager.set("backgroundOpacity", d.backgroundOpacity);
    StorageManager.set("themePreset",       d.themePreset);
    BdApi.UI.showToast("Configuración guardada", { type: "success" });
  };

  const hasUnsavedSettings =
    settingsDraft.aiName            !== appliedAiName            ||
    settingsDraft.aiSystem          !== appliedAiSystem          ||
    settingsDraft.textColor         !== appliedTextColor         ||
    settingsDraft.fontFamily        !== appliedFontFamily        ||
    settingsDraft.fontWeight        !== appliedFontWeight        ||
    settingsDraft.fontSize          !== appliedFontSize          ||
    settingsDraft.backgroundColor   !== appliedBackgroundColor   ||
    settingsDraft.backgroundOpacity !== appliedBackgroundOpacity ||
    settingsDraft.themePreset       !== appliedThemePreset;

  const totalWidth  = isSidebarOpen ? sizeRef.current.width + 180 : sizeRef.current.width;
  const windowStyle = {
    left:            `${posRef.current.x}px`,
    top:             `${posRef.current.y}px`,
    width:           `${totalWidth}px`,
    height:          `${sizeRef.current.height}px`,
    fontFamily:      appliedFontFamily,
    fontWeight:      appliedFontWeight,
    color:           appliedTextColor,
    fontSize:        `${appliedFontSize}px`,
    backgroundColor: hexToRgba(appliedBackgroundColor, Math.min(Math.max(appliedBackgroundOpacity, 0), 100) / 100),
    "--fkryx-font-family": appliedFontFamily,
    "--fkryx-font-weight": appliedFontWeight,
    "--fkryx-text-color":  appliedTextColor,
    "--fkryx-font-size":   `${appliedFontSize}px`,
    "--fkryx-theme":       appliedThemePreset
  };

  return React.createElement("div", { className: "fkryx-window", style: windowStyle, ref: windowRef },
    // Header
    React.createElement("div", { className: "fkryx-header", onMouseDown: handleMouseDown },
      React.createElement("span", { className: "fkryx-title" },
        view === "chat" ? `🤖 ${appliedAiName}` : "⚙️ Configuraciones de la IA"
      ),
      React.createElement("div", { style: { display: "flex", gap: "14px", alignItems: "center" } },
        React.createElement("button", {
          onClick: () => setIsSidebarOpen(!isSidebarOpen),
          className: `fkryx-header-icon fkryx-button-ripple ${isSidebarOpen ? "active-toggle" : ""}`,
          title: "Historial"
        }, React.createElement(Icon, { name: "folderOpen", size: 18 })),
        React.createElement("button", {
          onClick: () => setView(view === "chat" ? "settings" : "chat"),
          className: "fkryx-header-icon fkryx-button-ripple",
          title: view === "chat" ? "Ajustes" : "Volver al Chat"
        }, React.createElement(Icon, { name: "settings2", size: 18 })),
        React.createElement("button", {
          onClick: () => _WindowManager?.destroy(true),
          className: "fkryx-header-icon fkryx-button-ripple",
          title: "Cerrar"
        }, React.createElement(Icon, { name: "x", size: 18 }))
      )
    ),
    // Layout principal
    React.createElement("div", { className: "fkryx-main-layout" },
      isSidebarOpen && React.createElement(Sidebar, {
        activeChatId, chats: allChats,
        onSelectChat:    handleSelectChat,
        onCreateNewChat: handleCreateNewChat,
        onClose:         () => setIsSidebarOpen(false),
        onDeleteChat:    id => setDeleteConfirm({ id, title: allChats[id]?.title }),
        onRenameChat:    (id, title) => setRenameInfo({ id, value: title })
      }),
      React.createElement(ChatContainer, {
        currentView: view, aiName: appliedAiName, aiSystem: appliedAiSystem,
        activeChatId, settingsDraft, setSettingsDraft,
        onSaveSettings: handleSaveSettings,
        hasUnsavedSettings, appliedFontFamily, allChats
      })
    ),
    // Modal eliminar
    deleteConfirm && React.createElement("div", { className: "fkryx-modal-overlay" },
      React.createElement("div", { className: "fkryx-modal-card" },
        React.createElement("div", { className: "fkryx-modal-title" }, "Eliminar chat"),
        React.createElement("div", { className: "fkryx-modal-text" },
          `¿Eliminar '${deleteConfirm.title}'? Esta acción no se puede deshacer.`
        ),
        React.createElement("div", { className: "fkryx-modal-actions" },
          React.createElement("button", { className: "fkryx-modal-btn fkryx-modal-btn-cancel", onClick: () => setDeleteConfirm(null) }, "No"),
          React.createElement("button", { className: "fkryx-modal-btn fkryx-modal-btn-confirm", onClick: handleDeleteChat }, "Confirmar")
        )
      )
    ),
    // Modal renombrar
    renameInfo && React.createElement("div", { className: "fkryx-modal-overlay" },
      React.createElement("div", { className: "fkryx-modal-card" },
        React.createElement("div", { className: "fkryx-modal-title" }, "Renombrar chat"),
        React.createElement("input", {
          className: "fkryx-settings-input",
          value: renameInfo.value,
          onChange:  e => setRenameInfo(prev => ({ ...prev, value: e.target.value })),
          placeholder: "Nuevo nombre",
          autoFocus: true
        }),
        React.createElement("div", { className: "fkryx-modal-actions" },
          React.createElement("button", { className: "fkryx-modal-btn fkryx-modal-btn-cancel", onClick: () => setRenameInfo(null) }, "Cancelar"),
          React.createElement("button", { className: "fkryx-modal-btn fkryx-modal-btn-confirm", onClick: handleRenameChat }, "Guardar")
        )
      )
    ),
    // Handles de resize
    React.createElement("div", { className: "fkryx-resizable-handle handle-se", onMouseDown: handleResizeMouseDown }),
    React.createElement("div", { className: "fkryx-resizable-handle handle-e",  onMouseDown: handleResizeMouseDown }),
    React.createElement("div", { className: "fkryx-resizable-handle handle-s",  onMouseDown: handleResizeMouseDown })
  );
}