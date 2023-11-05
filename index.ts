import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

// Bot started
bot.start((ctx: Context) => {
  ctx.reply(
    'Welcome to the Stock Bot! Please enter the name of the stock you want to see the summary and latest news on:'
  );
});

// Bot asks
bot.on('text', async (ctx: Context) => {
  const stockName: string = ctx.message?.text || '';

  try {
    const rawData = await getStockSummary(stockName);
    const currency: string = rawData.earnings.financialCurrency;
    const lastYearIndex: number = rawData.earnings.financialsChart.yearly.length - 1;
    const lastYearData = rawData.earnings.financialsChart.yearly[lastYearIndex];
    const date: string = lastYearData.date;
    const revenue: string = lastYearData.revenue.fmt;

    const name: string = rawData.quoteType.longName;
    const sector: string = rawData.summaryProfile.sector;
    const noEmployee: number = rawData.summaryProfile.fullTimeEmployees;
    const summary: string = rawData.summaryProfile.longBusinessSummary;
    const website: string = rawData.summaryProfile.website;

    ctx.replyWithMarkdown(
      `Overview of ${stockName} - ${name}:\n\n` +
        `*Summary:* ${summary}\n` +
        `*Sector:* ${sector}\n` +
        `*Number of Employees:* ${noEmployee}\n` +
        `*Website:* [${website}](${website})\n` +
        `*Currency:* ${currency}\n` +
        `*For the year ${date}, ${name} made a revenue of ${revenue}*`
    );
  } catch (error) {
    console.error('Error:', error.message);
    ctx.reply(
      "Oops! Something went wrong. Please recheck the name of the company you're looking for, not its product name"
    );
  }
});

// Get the stock summary using Yahoo Finance API
async function getStockSummary(stockName: string) {
  const rapidApiKey: string = process.env.RAPIDAPI_KEY || '';
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
