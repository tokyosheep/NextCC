const express = require('express');
const session = require('express-session');
const next = require('next');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const port = parseInt(process.env.PORT || '3000');
const host = '0.0.0.0';

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});
const handle = app.getRequestHandler();

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
};

(async() => {
    await app.prepare();
    const expressApp = express();
    expressApp.use(logger('dev'));
    expressApp.use(express.urlencoded({ extended: false }));
    expressApp.use(express.json());
    expressApp.use(cookieParser());
    expressApp.use(session({
        secret: 'trythis',
        resave: false,
        saveUninitialized: true,
    }));

    expressApp.get('*', (req, res) => {
        return handle(req, res)
    });

    const server = https.createServer(options, expressApp);
    server.listen(port, host);
    console.log(`> Ready on https://localhost:${port}`);
})();