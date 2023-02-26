require("dotenv").config();
const { Client } = require("@notionhq/client");
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const databaseSchema = {
  Name: {
    title: {},
  },
  Symbol: {
    email: {},
  },
  Phone: {
    phone_number: {},
  },
  Description: {
    rich_text: {},
  },
};

async function createNotionDB(request, response) {
  try {
    const res = await notion.databases.create({
      parent: {
        page_id: "07854ff9bd3b4dafad32716ddf636533", // Replace this with the ID of the parent database or page
      },
      title: [
        {
          type: "text",
          text: {
            content: "New Database Name",
          },
        },
      ],
      properties: databaseSchema,
    });
    console.log(`Database created: ${res.id}`);

    response.status(200).json({
      data: res,
    });
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
}

module.exports = {
  createNotionDB,
};
