const express = require('express');
const path = require('path');

const app = express();

// Define o diretório para servir os arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Rota para servir o arquivo index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Inicia o servidor na porta 3000 (ou na porta definida pelo Heroku)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
