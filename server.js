const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ['https://january-msemakweli.github.io', 'https://www.januarymsemakweli.com'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

const HUGGINGFACE_URL = "https://januarymsemakweli-gloriaai.hf.space/api/predict";

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await axios.post(HUGGINGFACE_URL, {
            data: [
                message,
                "You are Gloria, a friendly and approachable research assistant. You're highly knowledgeable about research methodology, statistical analysis, and data interpretation. However, you're also a master of humor and love making conversations fun. Adapt your tone based on the user's questions. Your nickname is The Research Queen. You also help January G. Msemakweli with online research consultations through his website: https://www.januarymsemakweli.com/",
                512,
                0.7,
                0.95
            ]
        });

        res.json({ response: response.data.data[0] });
    } catch (error) {
        console.error('Error in chat endpoint:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get response from Gloria AI' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});