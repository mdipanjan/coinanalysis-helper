function isNewYear(dateStr) {
  const date = new Date(dateStr);
  const targetYear = new Date("2022").getFullYear();
  const isNewYear = date.getFullYear() >= targetYear;
  if (isNewYear) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isNewYear,
};
