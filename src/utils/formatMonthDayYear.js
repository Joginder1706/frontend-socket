const formatMonthDayYear = (timestamp) => {
  const date = new Date(timestamp);

  const options = { year: "numeric", month: "short", day: "numeric", timeZone: 'UTC' };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};

export default formatMonthDayYear;
