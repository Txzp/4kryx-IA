import { iconSvg } from "./icons.js";

export function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");
}

function createCopyButton(index) {
  return `<button class="fkryx-ai-action-btn fkryx-ai-copy-btn" data-action="copy" data-index="${index}" type="button">${iconSvg("copy")} Copiar</button>`;
}

function createAgainButton(index) {
  return `<button class="fkryx-ai-action-btn fkryx-ai-again-btn" data-action="again" data-index="${index}" type="button">${iconSvg("refreshCw")} Reintentar</button>`;
}

export function createAIMessage(title, content, index) {
  const safeContent = escapeHtml(content || "");
  const actions = content
    ? `<div class="fkryx-ai-response-actions">${createCopyButton(index)}${createAgainButton(index)}</div>`
    : "";
  return `<div class="fkryx-ai-response">
    <div class="fkryx-ai-response-header">
      <span class="fkryx-ai-response-title">${escapeHtml(title)}</span>
      ${actions}
    </div>
    <pre class="fkryx-ai-response-content">${safeContent}</pre>
  </div>`;
}