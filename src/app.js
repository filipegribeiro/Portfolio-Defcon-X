const express = require('express');
const bodyParser = require('body-parser');
/* const nodemailer = require('nodemailer'); */
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Configuração básica do CORS
app.use(
	cors({
		origin: 'http://127.0.0.1:5501', // Permitir apenas o frontend a partir deste URL (altera para o URL do teu frontend)
		methods: ['GET', 'POST'], // Métodos permitidos
		allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
	}),
);

// Rate Limiting - previne ataques de força bruta ou de negação de serviço (DoS)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // Limite de 100 pedidos por IP a cada 15 minutos
	message: 'Muitas solicitações deste IP, tente novamente mais tarde.',
});

// Aplicar rate limiting a todas as requisições
app.use(limiter);

// Config JSON response c/ limite de Mb
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware: Configurar bodyParser para lidar com dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Importar e usar as rotas
const route_email = require('./routes/route_email'); // Ajuste o caminho conforme a localização do arquivo
app.use('/email', route_email);

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
	console.log('Servidor a correr na porta 3000');
});
