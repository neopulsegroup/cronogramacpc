const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'localData.json');

app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.status(200).json(JSON.parse(data));
    } else {
      res.status(200).json({ sections: [] });
    }
  } catch (err) {
    console.error('Error reading localData.json:', err);
    res.status(500).json({ error: 'Erro ao ler dados', sections: [] });
  }
});

app.post('/api/data', (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.sections)) {
      return res.status(400).json({ error: 'Formato inválido: esperado { sections: [] }' });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
    res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error writing localData.json:', err);
    res.status(500).json({ error: 'Erro ao guardar dados' });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor local a correr em http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
