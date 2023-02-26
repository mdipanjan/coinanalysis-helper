require("dotenv").config();
const { api } = require("../config/api");
const { isNewYear } = require("../utils/dateUtil");
const moment = require("moment");
const {
  numberToBillions,
  percentageInCirculation,
} = require("../utils/number");
const { ExcelSchema } = require("../models/ExcelRowSchema");
const ExcelJS = require("exceljs");

async function generateReport(request, response) {
  try {
    const res = await api.get(
      "cryptocurrency/listings/latest?market_cap_max=10000000&limit=2000"
    );
    const { data } = res.data;
    const filterData = data.filter((item) => isNewYear(item.date_added));
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data");
    // Add headers to the sheet
    sheet.addRow(ExcelSchema);
    // Add data rows to the sheet
    for (const item of filterData) {
      sheet.addRow([
        item.id,
        item.name,
        item.symbol,
        item.num_market_pairs,
        moment(item.date_added).format("YYYY-MM-DD"),
        item.tags.join(", "),
        numberToBillions(item.max_supply),
        numberToBillions(item.circulating_supply),
        numberToBillions(item.total_supply),
        percentageInCirculation(item.max_supply, item.circulating_supply),
        numberToBillions(item.quote.USD.market_cap),
        numberToBillions(item.quote.USD.fully_diluted_market_cap),
        // item.platform.id,
        // item.platform.name,
        // item.platform.symbol,
        // item.platform.token_address,
        // item.cmc_rank,
        // item.self_reported_circulating_supply,
        // item.self_reported_market_cap,
        // item.last_updated,
        // item.quote.USD.price,
        // item.quote.USD.volume_24h,
        // item.quote.USD.volume_change_24h,
        // item.quote.USD.percent_change_1h,
        // item.quote.USD.percent_change_24h,
        // item.quote.USD.percent_change_7d,
        // item.quote.USD.percent_change_30d,
        // item.quote.USD.percent_change_60d,
        // item.quote.USD.percent_change_90d,
        // item.quote.USD.market_cap_dominance,
        // item.quote.USD.tvl,
      ]);
    }
    // Save the workbook to a file
    workbook.xlsx
      .writeFile("data.xlsx")
      .then(() => {
        console.log("Excel file created successfully!");
      })
      .catch((error) => {
        console.log(error);
      });

    response.status(200).send(filterData);
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
}
async function createNotionDBSchema() {
  const databaseSchema = {
    Name: {
      title: {},
    },
    Symbol: {
      rich_text: {},
    },
    Date: {
      rich_text: {},
    },
    "Max Supply": {
      rich_text: {},
    },
    "Ciculating Supply": {
      rich_text: {},
    },
  };
  return databaseSchema;
}
module.exports = {
  generateReport,
};
