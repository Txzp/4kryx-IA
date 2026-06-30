import { DiscordModules } from "../discord/modules.js";
import { Icon }           from "../utils/icons.js";

export function Sidebar({ activeChatId, onSelectChat, onCreateNewChat,
                          onClose, onDeleteChat, onRenameChat, chats }) {
  const React    = DiscordModules.react;
  const chatList = Object.values(chats).sort((a, b) => {
    if (a.id === "default") return -1;
    if (b.id === "default") return  1;
    return 0;
  });

  return React.createElement("div", { className: "fkryx-sidebar-gui" },
    React.createElement("div", { className: "fkryx-sidebar-header" },
      React.createElement("span", null, "Historial"),
      React.createElement("button", { onClick: onClose, className: "fkryx-sidebar-close-btn", title: "Ocultar" }, "◀")
    ),
    React.createElement("button", {
      className: "fkryx-new-chat-btn fkryx-button-ripple",
      onClick: onCreateNewChat,
      title: "Nuevo chat"
    }, React.createElement(Icon, { name: "plus", size: 16 }), " Nuevo Chat"),
    React.createElement("div", { className: "fkryx-sidebar-list" },
      chatList.length > 0
        ? chatList.map((chat, index) => {
            const isSelected = activeChatId === chat.id;
            return React.createElement("div", {
              key: chat.id,
              className: `fkryx-sidebar-item ${isSelected ? "selected" : ""}`,
              style: { animationDelay: `${index * 30}ms` }
            },
              React.createElement("button", {
                className: "fkryx-sidebar-item-button",
                onClick: () => onSelectChat(chat.id)
              }, chat.title || "Sin nombre"),
              React.createElement("div", { className: "fkryx-sidebar-actions" },
                React.createElement("button", {
                  className: "fkryx-sidebar-rename-btn fkryx-button-ripple",
                  onClick: e => { e.stopPropagation(); onRenameChat(chat.id, chat.title); },
                  title: "Renombrar"
                }, React.createElement(Icon, { name: "edit3", size: 16 })),
                React.createElement("button", {
                  className: "fkryx-sidebar-delete-btn fkryx-button-ripple",
                  onClick: e => { e.stopPropagation(); onDeleteChat(chat.id); },
                  title: "Eliminar"
                }, React.createElement(Icon, { name: "trash2", size: 16 }))
              )
            );
          })
        : React.createElement("div", {
            style: { color: "#72767d", fontSize: "12px", padding: "8px", textAlign: "center" }
          }, "Sin conversaciones")
    )
  );
}