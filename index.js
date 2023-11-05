const { Telegraf } = require('telegraf');
const axios = require('axios');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Bot started
bot.start((ctx) => {
  ctx.reply(
    'Welcome to the Stock Bot! Please enter the name of the stock you want to see the summary and latest news on:'
  );
});

// Bot asks
bot.on('text', async (ctx) => {
  const stockName = ctx.message.text;

  try {
    const rawData = await getStockSummary(stockName);
    const currency = rawData.earnings.financialCurrency;
    const lastYearIndex = rawData.earnings.financialsChart.yearly.length - 1;
    const lastYearData = rawData.earnings.financialsChart.yearly[lastYearIndex];
    const date = lastYearData.date;
    const revenue = lastYearData.revenue.fmt;

    const name = rawData.quoteType.longName;
    const sector = rawData.summaryProfile.sector;
    const noEmployee = rawData.summaryProfile.fullTimeEmployees;
    const summary = rawData.summaryProfile.longBusinessSummary;
    const website = rawData.summaryProfile.website;

    ctx.reply(
      `Overview of ${stockName} - ${name}:
      \nSummary: ${summary}
      \nSector: ${sector}
      \nNumber of Employees: ${noEmployee}
      \nWebsite: ${website}
      \nCurrency: ${currency}
      \nFor the year ${date}, ${name} made a revenue of ${revenue}`
    );
  } catch (error) {
    console.error('Error:', error.message);
    ctx.reply(
      "Oops! Something went wrong. Please recheck the name of the company you're looking for, not its product name"
    );
  }
});

// Get the stock summary using Yahoo Finance API
async function getStockSummary(stockName) {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const options = {
    method: 'GET',
    url: 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary',
    params: {
      symbol: stockName,
      region: 'US',
    },
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
    },
  };

  const response = await axios.request(options);

  const rawData = response.data;
  return rawData;
}

bot.launch();
