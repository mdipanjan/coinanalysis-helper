require("dotenv").config();
const { api, createApi } = require("../config/api");
const { isNewYear } = require("../utils/dateUtil");
const { Client } = require("@notionhq/client");
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function generateReport(request, response) {
  try {
    const res = await api.get(
      "cryptocurrency/listings/latest?market_cap_max=10000000&limit=2000"
    );
    const { data } = res.data;
    const filterData = data.filter((item) => isNewYear(item.date_added));
    const notionDBSchema = await createNotionDBSchema(filterData);
    const result = await notion.databases.create({
      parent: {
        page_id: "07854ff9bd3b4dafad32716ddf636533", // Replace this with the ID of the parent database or page
      },
      title: [
        {
          type: "text",
          text: {
            content: "Coin Report",
          },
        },
      ],
      properties: notionDBSchema,
    });
    if (result?.data?.id) {
      let { id } = result.data;
      try {
        for (const item of filterData) {
          // Set up the properties for the new page
          const properties = {
            Name: { title: [{ text: { content: item.name } }] },
            Symbol: { rich_text: [{ text: { content: item.symbol } }] },
            Date: { date: { start: item.date_added } },
            "Max Supply": { number: item.max_supply },
            "Circulating Supply": { number: item.circulating_supply },
            // Add more properties as needed
          };
          // Create a new page in the database with the specified properties
          try {
            const createdPage = await notion.pages.create(
              {
                parent: { database_id: id },
                properties,
              },
              { timeout: 10000 }
            );
            console.log("Created page:", createdPage);
          } catch (error) {
            console.log("Error creating page:", error);
          }
        }
      } catch (error) {
        console.log("Error in for loop:", error);
      }

      response.status(200).json({
        data: result,
      });
    }
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
      date: {},
    },
    "Max Supply": {
      number: {},
    },
    "Ciculating Supply": {
      number: {},
    },
  };
  return databaseSchema;
}
module.exports = {
  generateReport,
};

// ---------------------------------------------

require("dotenv").config();
const { api } = require("../config/api");
const { isNewYear } = require("../utils/dateUtil");
const moment = require("moment");

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
    sheet.addRow([
      "ID",
      "Name",
      "Symbol",
      "Market Pairs",
      "Date Added",
      "Tags",
      "Max Supply",
      "Circulating Supply",
      "Total Supply",
      "Platform ID",
      "Platform Name",
      "Platform Symbol",
      "Platform Token Address",
      "Rank",
      "Reported Circulating Supply",
      "Reported Market Cap",
      "Last Updated",
      "Price",
      "Volume 24H",
      "Volume Change 24H",
      "% Change 1H",
      "% Change 24H",
      "% Change 7D",
      "% Change 30D",
      "% Change 60D",
      "% Change 90D",
      "Market Cap",
      "Market Cap Dominance",
      "Fully Diluted Market Cap",
      "TVL",
    ]);
    // Add data rows to the sheet
    for (const item of filterData) {
      sheet.addRow([
        item.id,
        item.name,
        item.symbol,
        item.num_market_pairs,
        moment(item.date_added).format("YYYY-MM-DD"),
        item.tags.join(", "),
        item.max_supply,
        item.circulating_supply,
        item.total_supply,
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
        // item.quote.USD.market_cap,
        // item.quote.USD.market_cap_dominance,
        // item.quote.USD.fully_diluted_market_cap,
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
