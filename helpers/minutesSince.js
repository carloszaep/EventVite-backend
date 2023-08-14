export function calcMinutesSince (timeFrom) {
  const now = new Date()

  // Calculate the difference in minutes
  const minutesSince = Math.floor((now - timeFrom) / (1000 * 60))

  return minutesSince
}
