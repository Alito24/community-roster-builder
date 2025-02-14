const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store data in a JSON file
const DATA_FILE = 'roster.json';

// Get all characters
app.get('/characters', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') {
            res.json([]);
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

// Add new character
app.post('/characters', async (req, res) => {
    try {
        let characters = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            characters = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        
        characters.push(req.body);
        await fs.writeFile(DATA_FILE, JSON.stringify(characters));
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});