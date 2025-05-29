app.post('/generate-full-scenario', async (req, res) => {
  try {
    const prompt = `
Придумай оригинальный и эмоционально насыщенный сценарий для реалистичного рассказа в духе женской прозы.
Ответь строго в формате JSON, без пояснений:

{
  "hero": "...",
  "conflict": "...",
  "setting": "...",
  "obstacle": "...",
  "twist": "..."
}`.trim();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        temperature: 0.9,
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const jsonText = data.choices?.[0]?.message?.content;

    try {
      const scenario = JSON.parse(jsonText);
      res.json(scenario);
    } catch (err) {
      res.json({ error: 'Ошибка парсинга JSON от GPT', raw: jsonText });
    }
  } catch (err) {
    console.error('Ошибка при генерации сценария:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
