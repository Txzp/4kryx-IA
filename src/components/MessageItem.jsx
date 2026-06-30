import { escapeHtml, createAIMessage } from "../utils/html.js";

export function buildMessagesHtml(messages, aiName, isThinking) {
  if (messages.length === 0) {
    return `<div style="color:#72767d;text-align:center;margin-top:40px;font-size:14px;">
      ¡Hola! Soy ${escapeHtml(aiName)}. ¿En qué te ayudo hoy?
    </div>`;
  }

  let assistantIndex = -1;

  const html = messages.map(msg => {
    if (msg.role === "user") {
      return `<div class="fkryx-message-wrapper user-align">
        <div class="fkryx-message-meta"><strong class="meta-user">Tú</strong></div>
        <div class="fkryx-chat-bubble bubble-user">
          <span style="white-space:pre-wrap;">${escapeHtml(msg.content)}</span>
        </div>
      </div>`;
    }
    assistantIndex += 1;
    return `<div class="fkryx-message-wrapper ai-align">
      ${createAIMessage(aiName, msg.content, assistantIndex)}
    </div>`;
  }).join("");

  const typingHtml = (isThinking && messages.at(-1)?.content === "")
    ? `<div class="fkryx-message-wrapper ai-align">
        <div class="fkryx-chat-bubble bubble-ai-typing">
          <div class="fkryx-typing-dot"></div>
          <div class="fkryx-typing-dot"></div>
          <div class="fkryx-typing-dot"></div>
        </div>
       </div>`
    : "";

  return html + typingHtml + `<div id="fkryx-ai-chat-end"></div>`;
}