let displayNames = null;
try {
  displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
} catch {
  displayNames = null;
}

export function languageName(code) {
  if (!code) return 'Unknown';
  try {
    return displayNames?.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

// 125 -> "2h 5m", 120 -> "2h", 45 -> "45m", unknown -> null
export function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return `${h}h${m ? ` ${m}m` : ''}`;
}

export const formatCount = (n) => Number(n || 0).toLocaleString('en-US');

export const pickRandom = (list) => (list.length ? list[Math.floor(Math.random() * list.length)] : null);
