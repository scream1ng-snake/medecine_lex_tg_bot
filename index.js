const TelegramBot = require('node-telegram-bot-api');

const token = '6070228695:AAEND6FJmusuX-c3g6rujIWhRv8PbFpfQ5Y';

const bot = new TelegramBot(token, {polling: true});

const webAppUrl = 'https://646912b9268c134b25d04d08--curious-puffpuff-a70a97.netlify.app/';

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if(text === '/start') {
    await bot.sendMessage(chatId, 'Интерет магазин', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Сделать заказ',
            web_app: {
              url: webAppUrl
            }
          }]
        ]
      }
    });
  }
});