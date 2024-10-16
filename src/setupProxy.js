﻿const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    '/api',
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:55000',
        secure: false
    });

    app.use(appProxy);
};
