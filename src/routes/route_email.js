const express = require('express');
/* const nodemailer = require('nodemailer'); */
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
require('dotenv').config();
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuração do Mailgun

const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere',
});

/* const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN,
}); */

// Configuração do Nodemailer
/* const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
}); */

//? A TÍTULO DE EXEMPLO:

//TODO Se fosse transporte de SMTP genérico, que permite enviar emails através do servidor SMTP (Simple Mail Transfer Protocol) que escolheres (ou seja, qualquer serviço de email entrem em contacto contigo):
/* const transporter = nodemailer.createTransport({
	host: 'smtp.exemplo.com',
	port: 465,
	secure: true, // true para 465, false para 587
	auth: {
		user: process.env.EMAIL_USER, // Substitui pelo teu email
		pass: process.env.EMAIL_PASS, // Substitui pela tua palavra-passe
	},
}); */

// Rota para o envio de emails
router.post(
	'/send-email',
	[
		// Validação e Sanitização - previne ataques como o XSS (Cross-Site Scripting)
		body('name').not().isEmpty().trim().escape().withMessage('Nome é obrigatório e deve ser seguro.'),
		body('email').isEmail().normalizeEmail().withMessage('Um email válido é obrigatório.'),
		body('message').not().isEmpty().trim().escape().withMessage('Mensagem é obrigatória e deve ser segura.'),
	],
	async (req, res) => {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, message } = req.body;
		console.log('Received message request: ', req.body);

		//TODO Validação é feita pelo express-validator, pelo que o que está abaixo é redundante! Serve como lembrança:

		/* // Verificar se os campos estão preenchidos
		if (!name || !email || !message) {
			return res.status(400).send('Todos os campos são obrigatórios.');
		}

		// Validar formato do email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).send('Email inválido.');
		}

		// Limitar o tamanho da mensagem
		if (message.length > 1000) {
			return res.status(400).send('A mensagem é demasiado longa.');
		} */

		// Dados do email
		const data = {
			from: `Portfolio de Filipe Ribeiro <mailgun@sandboxb7daad15fc6b47ba96d1fab106934b51.mailgun.org>`,
			to: ['g.filipe.r@gmail.com'],
			subject: `Nova mensagem de ${name}`,
			text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
		};

		// Enviar email através do Mailgun
		try {
			const msg = await mg.messages.create('sandboxb7daad15fc6b47ba96d1fab106934b51.mailgun.org', data);
			console.log('Email enviado:', msg);
			res.status(200).send('Mensagem enviada com sucesso!');
		} catch (error) {
			console.log('Erro ao enviar email:', error);
			res.status(500).json({ message: 'Erro ao enviar email', error: error.message });
		}

		/* try {
			const info = await transporter.sendMail(data);
			console.log('Email enviado: ' + info.response);
			res.status(200).send('Mensagem enviada com sucesso!');
		} catch (error) {
			console.log('Erro ao enviar email: ', error);
			res.status(500).send('Erro ao enviar email: ' + error.message);
		} */
	},
);

module.exports = router;
