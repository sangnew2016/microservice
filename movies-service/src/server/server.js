const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const spdy = require('spdy');

const api = require('../api/movies');

const start = (options) => {
    return new Promise((resolve, reject) => {
        if (!options.repo) {
            reject(new Error('The server must be started with a connected repository'));
        }
        if (!options.port) {
            reject(new Error('The server must be sstarted with a available port'));
        }

        const app = express();
        app.use(morgan('dev'));
        app.use(helmet());
        app.use((err, req, res, next) => {
            reject(new Error('Something was wrong!, err: ' + err));
            res.status(500).send('Something was wrong');
        });

        api(app, options);

        // here is where we made the modifications, we create a spdy
        // server, then we pass the ssl certs, and the express app
        const server = spdy
            .createServer(options.ssl, app)
            .listen(options.port, () => resolve(server));        

    });
};

module.exports = Object.assign({}, {start});
