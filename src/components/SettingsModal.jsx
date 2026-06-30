import { DiscordModules } from "../discord/modules.js";
import { FONT_OPTIONS }   from "../config.js";

export function SettingsModal({ settingsDraft, setSettingsDraft, onSave, hasUnsaved, appliedFontFamily }) {
  const React  = DiscordModules.react;
  const update = (field, value) =>
    setSettingsDraft(prev => ({ ...prev, [field]: value }));

  return React.createElement("div", { className: "fkryx-settings-body" },
    React.createElement("div", { className: "fkryx-settings-title centered" }, "| | - AI Personalization - | |"),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Nombre de la IA"),
      React.createElement("input", {
        type: "text",
        value: settingsDraft.aiName,
        onChange: e => update("aiName", e.target.value),
        className: "fkryx-settings-input"
      })
    ),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Instrucciones que debe seguir la IA"),
      React.createElement("textarea", {
        value: settingsDraft.aiSystem,
        onChange: e => update("aiSystem", e.target.value),
        className: "fkryx-settings-textarea"
      })
    ),
    React.createElement("div", { className: "fkryx-settings-title centered" }, "| | - Custom Lettering - | |"),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Color de letras"),
      React.createElement("input", {
        type: "color",
        value: settingsDraft.textColor,
        onChange: e => update("textColor", e.target.value),
        className: "fkryx-settings-color-input"
      })
    ),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Fuente personalizada"),
      React.createElement("select", {
        className: "fkryx-settings-select",
        value: settingsDraft.fontFamily,
        onChange: e => update("fontFamily", e.target.value)
      }, FONT_OPTIONS.map(f =>
        React.createElement("option", { key: f.value, value: f.value }, f.label)
      )),
      React.createElement("span", { className: "fkryx-settings-subtext" },
        settingsDraft.fontFamily === appliedFontFamily
          ? "✔ Esta fuente está aplicada"
          : "Selecciona una fuente para aplicarla"
      )
    ),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Tamaño de letras"),
      React.createElement("div", { className: "fkryx-font-size-control" },
        React.createElement("button", {
          className: "fkryx-font-size-btn",
          onClick: () => update("fontSize", Math.max(10, settingsDraft.fontSize - 1))
        }, "-"),
        React.createElement("span", { className: "fkryx-font-size-value" }, `${settingsDraft.fontSize}px`),
        React.createElement("button", {
          className: "fkryx-font-size-btn",
          onClick: () => update("fontSize", Math.min(32, settingsDraft.fontSize + 1))
        }, "+")
      )
    ),
    React.createElement("div", { className: "fkryx-settings-help" },
      "El color y la fuente se aplican a toda la ventana y a todos los textos."
    ),
    React.createElement("div", { className: "fkryx-settings-title centered" }, "| | - Background - | |"),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Color de fondo"),
      React.createElement("input", {
        type: "color",
        value: settingsDraft.backgroundColor,
        onChange: e => update("backgroundColor", e.target.value),
        className: "fkryx-settings-color-input"
      })
    ),
    React.createElement("div", { className: "fkryx-setting-item" },
      React.createElement("label", { className: "fkryx-setting-label" }, "Transparencia del fondo"),
      React.createElement("div", { className: "fkryx-font-size-control" },
        React.createElement("input", {
          type: "range", min: "0", max: "100",
          value: settingsDraft.backgroundOpacity,
          onChange: e => update("backgroundOpacity", Number(e.target.value)),
          className: "fkryx-settings-select",
          style: { width: "100%" }
        })
      ),
      React.createElement("span", { className: "fkryx-settings-subtext" },
        `${settingsDraft.backgroundOpacity}% opacidad`
      )
    ),
    React.createElement("div", { className: "fkryx-settings-help" },
      "Configura el color y la transparencia del fondo de la ventana de IA."
    ),
    hasUnsaved && React.createElement("button", {
      className: "fkryx-save-settings-btn",
      onClick: onSave
    }, "Guardar configuración")
  );
}