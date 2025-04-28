const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: process.env.AI_PROMPT },
        { role: "user", content: message }
      ],
      stream: false   // Use true if you have streaming setup
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error("DeepSeek API Error:", err.message);
    res.status(500).json({ error: 'AI Assistant error. Please try again later.' });
  }
};
