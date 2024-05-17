require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
});

app.use(Sentry.Handlers.requestHandler());
app.use(logger('dev'));
app.use(express.json());

const routes = require('./routes');
app.use('/api/v1', routes);

app.use(Sentry.Handlers.errorHandler());

// 500 error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: `Are you lost? ${req.method} ${req.url} is not registered!`,
        data: null
    });
});

module.exports = app;