const numberToMillions = (number) => {
  const millionsNum = (number / 1000000).toFixed(2) + "M";
  return millionsNum;
};
function numberToBillions(num) {
  if (num < 1e9) {
    return numberToMillions(num);
  }

  console.log("Billions FOund");
  return (num / 1e9).toFixed(2) + " B";
}
function percentageInCirculation(max, circulating) {
  return (circulating / max) * 100;
}
module.exports = {
  numberToMillions,
  numberToBillions,
  percentageInCirculation,
};
