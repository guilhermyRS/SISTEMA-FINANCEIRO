const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const financeRoutes = require('./routes/financeRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add auth routes before finance routes
app.use('/', authRoutes);
app.use('/', financeRoutes);

// Error handling
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: 'Página não encontrada',
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Erro interno do servidor',
    error: { status: 500 }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});