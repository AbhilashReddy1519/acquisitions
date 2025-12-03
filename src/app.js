// This file is all about setting up the express application logic with right middlewares

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import logger from '#config/logger.js';
import authRoutes from '#routes/auth.route.js';
import securityMiddleware from '#middlewares/security.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// we are actually combining both out logging library through winston and morgan by passing over morgans messages into our logger
app.use(
  morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } })
);

app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions');
  res.status(200).send('Hello, World! from acquisitions application');
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is Running' });
});

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
});

app.use('/api/auth', authRoutes);

export default app;
