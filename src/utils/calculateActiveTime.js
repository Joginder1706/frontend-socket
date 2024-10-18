function calculateActiveTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);

  const diffInSeconds = Math.floor((now - time) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let interval in intervals) {
    const diff = Math.floor(diffInSeconds / intervals[interval]);
    if (diff >= 1) {
      return `about ${diff} ${interval}${diff > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export default calculateActiveTime;
