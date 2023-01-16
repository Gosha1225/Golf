export function getTimeFromText(timeText) {
  const [minutes, seconds] = timeText.split(":");
  return { minutes: Number(minutes), seconds: Number(seconds) };
}
