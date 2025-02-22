const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Analytics Prediction Route
app.post('/analytics', (req, res) => {
    const inputData = req.body;
    
    const pythonProcess = spawn('python', ['predict_analytics.py', JSON.stringify(inputData)]);
    
    let resultData = '';
    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json(JSON.parse(resultData));
        } else {
            res.status(500).json({ error: 'Error processing analytics prediction' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});