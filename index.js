"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var axios_1 = require("axios");
require('dotenv').config();
var bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
// Bot started
bot.start(function (ctx) {
    ctx.reply('Welcome to the Stock Bot! Please enter the name of the stock you want to see the summary and latest news on:');
});
// Bot asks
bot.on('text', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var stockName, rawData, currency, lastYearIndex, lastYearData, date, revenue, name_1, sector, noEmployee, summary, website, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                stockName = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getStockSummary(stockName)];
            case 2:
                rawData = _b.sent();
                currency = rawData.earnings.financialCurrency;
                lastYearIndex = rawData.earnings.financialsChart.yearly.length - 1;
                lastYearData = rawData.earnings.financialsChart.yearly[lastYearIndex];
                date = lastYearData.date;
                revenue = lastYearData.revenue.fmt;
                name_1 = rawData.quoteType.longName;
                sector = rawData.summaryProfile.sector;
                noEmployee = rawData.summaryProfile.fullTimeEmployees;
                summary = rawData.summaryProfile.longBusinessSummary;
                website = rawData.summaryProfile.website;
                ctx.replyWithMarkdown("Overview of ".concat(stockName, " - ").concat(name_1, ":\n\n") +
                    "*Summary:* ".concat(summary, "\n") +
                    "*Sector:* ".concat(sector, "\n") +
                    "*Number of Employees:* ".concat(noEmployee, "\n") +
                    "*Website:* [".concat(website, "](").concat(website, ")\n") +
                    "*Currency:* ".concat(currency, "\n") +
                    "*For the year ".concat(date, ", ").concat(name_1, " made a revenue of ").concat(revenue, "*"));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Error:', error_1.message);
                ctx.reply("Oops! Something went wrong. Please recheck the name of the company you're looking for, not its product name");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get the stock summary using Yahoo Finance API
function getStockSummary(stockName) {
    return __awaiter(this, void 0, void 0, function () {
        var rapidApiKey, options, response, rawData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rapidApiKey = process.env.RAPIDAPI_KEY || '';
                    options = {
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
                    return [4 /*yield*/, axios_1.default.request(options)];
                case 1:
                    response = _a.sent();
                    rawData = response.data;
                    return [2 /*return*/, rawData];
            }
        });
    });
}
bot.launch();
