const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/log', (req, res) => {
  const log = {
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  fs.readFile('logs.json', 'utf8', (err, data) => {
    const logs = err ? [] : JSON.parse(data);
    logs.push(log);
    fs.writeFile('logs.json', JSON.stringify(logs, null, 2), () => {});
  });

  res.status(200).json({ message: 'Logged successfully' });
});

app.get('/logs', (req, res) => {
  fs.readFile('logs.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read logs' });
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
