const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // ✅ 1. Импорт cors
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ 2. Подключение cors ДО любых маршрутов
app.use(express.json());

// ✅ Точка маршрута для генерации сценария
app.post('/generate-full-scenario', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Сгенерируй уникальный сценарий рассказа в JSON формате. Пример:
{
  "hero": "Анна, молодая библиотекарь из провинции",
  "conflict": "Узнаёт, что дом, в котором она живёт, подлежит сносу",
  "setting": "маленький город осенью",
  "obstacle": "чиновник, заинтересованный в продаже участка",
  "twist": "оказывается, что в подвале хранятся архивы, которые могут изменить всё"
}`
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    const data = await response.json();

    try {
      const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
      res.json(parsed);
    } catch (e) {
      res.json({ error: 'Ошибка парсинга', raw: data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`GPT Proxy сервер запущен на порту ${PORT}`);
});
