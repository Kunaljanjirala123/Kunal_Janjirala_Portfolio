const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');  
 // Use OpenAI SDK
require('dotenv').config();
const fs = require('fs');
const AI_PROMPT = fs.readFileSync('public/assets/prompt.txt', 'utf-8');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Initialize OpenAI Client for DeepSeek
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});



app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const stream = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: process.env.AI_PROMPT },
                { role: "user", content: userMessage }
            ],
            stream: true,
            temperature: 0.2,
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            res.write(content);
        }

        res.end();

    } catch (err) {
        console.error('Streaming Error:', err.message);
        res.status(500).send('Stream failed.');
    }
});


// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
