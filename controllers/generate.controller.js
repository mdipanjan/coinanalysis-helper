require("dotenv").config();
const { api } = require("../config/api");
const { isNewYear } = require("../utils/dateUtil");

async function generateReport(request, response) {
  try {
    const res = await api.get(
      "cryptocurrency/listings/latest?market_cap_max=10000000&limit=2000"
    );
    const { data } = res.data;
    const filterData = data.filter((item) => isNewYear(item.date_added));
    response.status(200).json({
      data: filterData,
    });
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
}

module.exports = {
  generateReport,
};
