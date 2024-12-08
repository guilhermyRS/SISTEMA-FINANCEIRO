// server.js
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./routes/financeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  }
}));

// Routes
app.use('/', routes);

// Error handling
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Página não encontrada', error: { status: 404 } });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Erro interno do servidor', error: { status: 500 } });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Ensure all environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY || !process.env.SESSION_SECRET) {
  console.error('Erro: Variáveis de ambiente necessárias não estão definidas.');
  process.exit(1);
}

// ... (rest of the server.js file remains the same)

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando o servidor...');
  app.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Exceção não tratada:', error);
  process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'razão:', reason);
  // Application specific logging, throwing an error, or other logic here
});