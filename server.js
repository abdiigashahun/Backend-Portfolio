require('dotenv').config();
const express = require('express');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/api/sendMessage', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const telegramMessage = `
📬 *New Contact Message*
👤 *Name:* ${name}
📧 *Email:* ${email}
💬 *Message:* ${message}
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: 'Failed to send Telegram message' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Telegram API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
