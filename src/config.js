export const PLUGIN_NAME = "4kryxAI";

export const defaultSettings = {
  selectedmodel: "openai",
  windowpos: { x: 100, y: 100 },
  windowsize: { width: 440, height: 560 },
  aiName: "4kryx AI",
  aiSystemPrompt: "Eres 4kryxAI, un asistente avanzado integrado en Discord. Responde de forma clara, directa, concisa y usa emojis ocasionalmente. Mantén respuestas breves (máximo 2-3 párrafos). Si es código, sé específico.",
  textColor: "#dcddde",
  fontFamily: "Whitney, Segoe UI, Arial, sans-serif",
  fontWeight: 400,
  fontSize: 14,
  backgroundColor: "#202225",
  backgroundOpacity: 80,
  themePreset: "dark",
  activeChatId: "default",
  allChats: {
    default: { id: "default", title: "Chat Principal", messages: [] }
  }
};

export const FONT_OPTIONS = [
  { label: "Segoe UI",    value: "Segoe UI, Arial, sans-serif" },
  { label: "Roboto",      value: "Roboto, Arial, sans-serif" },
  { label: "Arial",       value: "Arial, sans-serif" },
  { label: "Verdana",     value: "Verdana, Geneva, sans-serif" },
  { label: "Courier New", value: "Courier New, Courier, monospace" }
];

export const FONT_WEIGHT_OPTIONS = [
  { label: "300 (Light)",    value: 300 },
  { label: "400 (Regular)",  value: 400 },
  { label: "500 (Medium)",   value: 500 },
  { label: "600 (SemiBold)", value: 600 }
];

export const THEME_PRESETS = [
  { label: "Dark",     value: "dark" },
  { label: "Midnight", value: "midnight" },
  { label: "Glass",    value: "glass" }
];