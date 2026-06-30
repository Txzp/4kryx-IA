export const ICON_PATHS = {
  folderOpen: [
    "M3 7V5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2",
    "M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"
  ],
  settings2: [
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 6.14 3.1l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  ],
  x:         ["M18 6L6 18", "M6 6l12 12"],
  send:      ["M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H.75a.75.75 0 000 1.5h4.232l-2.432 7.905a.75.75 0 10.926.94l8.5-27a.75.75 0 00-.926-1.94L3.478 2.405z"],
  trash2:    ["M3 6h18M8 6V4a1 1 0 011-1h4a1 1 0 011 1v2M5 6v12a1 1 0 001 1h12a1 1 0 001-1V6M10 11v6M14 11v6"],
  copy: [
    "M8 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3",
    "M16 3h5a2 2 0 0 1 2 2v11",
    "M18 7H8a2 2 0 0 0-2 2v10"
  ],
  refreshCw: ["M23 4v6h-6", "M20.49 15a9 9 0 1 1-2.13-9.36"],
  plus:      ["M12 5v14", "M5 12h14"],
  edit3:     ["M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"]
};

export function Icon({ name, size = 18 }) {
  const React = BdApi.React;
  const paths = ICON_PATHS[name] || [];
  return React.createElement("svg", {
    viewBox: "0 0 24 24", width: size, height: size,
    fill: "none", stroke: "currentColor",
    strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round",
    style: { display: "block" }
  }, paths.map((d, i) => React.createElement("path", { key: i, d })));
}

export function iconSvg(name) {
  const paths = ICON_PATHS[name] || [];
  return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths.map(d => `<path d="${d}"/>`).join("")}</svg>`;
}