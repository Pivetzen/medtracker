const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Listar medicamentos
app.get('/meds', (req, res) => {
  db.all("SELECT * FROM medications", [], (err, rows) => {
    res.json(rows);
  });
});

// Adicionar medicamento
app.post('/meds', (req, res) => {
  const { name, interval } = req.body;

  db.run(
    "INSERT INTO medications (name, interval, last_taken) VALUES (?, ?, ?)",
    [name, interval, Date.now()],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// Registrar uso
app.post('/take/:id', (req, res) => {
  db.run(
    "UPDATE medications SET last_taken = ? WHERE id = ?",
    [Date.now(), req.params.id],
    () => {
      res.json({ success: true });
    }
  );
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
