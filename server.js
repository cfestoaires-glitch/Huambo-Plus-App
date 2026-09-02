
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir os ficheiros da aplicação
app.use(express.static(path.join(__dirname, 'public')));

// Verificação de funcionamento do servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    plataforma: 'Huambo Plus',
    message: 'Servidor a funcionar corretamente'
  });
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback para a aplicação web
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Huambo Plus a funcionar na porta ${PORT}`);
});
