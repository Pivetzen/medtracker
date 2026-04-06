const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ===== ROTAS API =====

// Listar medicamentos
app.get('/meds', (req, res) => {
  db.all("SELECT * FROM medications", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar medicamento
app.post('/meds', (req, res) => {
  const { name, interval } = req.body;

  if (!name || !interval) {
    return res.status(400).json({ error: "Nome e intervalo são obrigatórios" });
  }

  db.run(
    "INSERT INTO medications (name, interval, last_taken) VALUES (?, ?, ?)",
    [name, interval, Date.now()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Registrar uso
app.post('/take/:id', (req, res) => {
  db.run(
    "UPDATE medications SET last_taken = ? WHERE id = ?",
    [Date.now(), req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ===== FRONTEND =====

const frontendPath = path.resolve(__dirname, '../frontend');

// TESTE: loga o caminho real
console.log("Caminho do frontend:", frontendPath);

// Servir arquivos estáticos
app.use(express.static(frontendPath));

// Rota principal (FORÇA abrir index.html)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// ===== SERVIDOR =====

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
