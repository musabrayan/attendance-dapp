export function dateToNumber(dateStr) {
  // expects dateStr like "YYYY-MM-DD" -> returns YYYYMMDD as number
  return parseInt(dateStr.replace(/-/g, ''), 10);
}

export function formatDateNumber(num) {
  const s = num.toString();
  if (s.length !== 8) return s;
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
}
