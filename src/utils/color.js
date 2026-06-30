export function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace("#", "").trim();
  const full = normalized.length === 3
    ? normalized.split("").map(c => c + c).join("")
    : normalized;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8)  & 255;
  const b =  bigint        & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}