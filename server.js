const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const LOG_FILE = 'logs.json';

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '[]');
}

app.get('/log', (req, res) => {
  const log = {
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    let logs = [];
    try {
      logs = JSON.parse(data || '[]');
    } catch (e) {
      logs = [];
    }

    logs.push(log);
    fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), () => {});
  });

  res.status(200).json({ message: 'Logged successfully' });
});

app.get('/logs', (req, res) => {
  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read logs' });

    let logs = [];
    try {
      logs = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Corrupted log file' });
    }

    res.json({ count: logs.length, logs });
  });
});
