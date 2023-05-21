const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const PORT = 8000;
const token = '6070228695:AAEND6FJmusuX-c3g6rujIWhRv8PbFpfQ5Y';

const bot = new TelegramBot(
  token, 
  { polling: true }
);

const app = express();
app.use(express.json());
app.use(cors());

const webAppUrl = 'https://curious-puffpuff-a70a97.netlify.app';

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появиться кнопка, заполни форму', {
      reply_markup: {
        keyboard: [
          [{
            text: 'Заполни форму',
            web_app: {
              url: webAppUrl + '/form'
            }
          }]
        ]
      }
    });
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
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, 'Спасибо за обратную связь');
      await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
      await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);
      setImmediate(() => {
        bot.sendMessage(chatId, 'Всю информацию вы получите в нашем чате');
      }, 3000);
    } catch (e) {
      console.error(e)
    }
  }
});

app.post('/web-data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка!',
      input_message_content: {
        message_text: 'Поздравляю с покупкой! Вы приобрели товар на сумму: ' + totalPrice
      }
    })
    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не удалось приобрести товар(((',
      input_message_content: {
        message_text: 'Не удалось приобрести товар((('
      }
    })
    return res.status(500).json({});
  }
})

app.listen(PORT, () => 
  console.log('Server running at port = ' + PORT)
)