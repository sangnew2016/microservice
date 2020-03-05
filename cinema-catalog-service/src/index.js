/*=======================================
    + Workflow code:
        config -> repository -> api -> server -> index.js
    + Workflow run:
        index -> server -> repository -> api    
==========================================*/

'use strict';

const {EventEmitter} = require('events');
const server = require('./server/server');
const repository = require('./repository/repository');
const config = require('./config/');
const mediator = new EventEmitter();

console.log('---------- Cinemas Catalog Service ----------');
console.log('Connecting to cinemas catalog repository');

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', (err) => {
    console.error('Unhandled Rejection', err);
});

mediator.on('db.ready', (db) => {
    let rep;

    repository.connect({db, ObjectID: config.ObjectID})
    .then(repo => {
        console.log('Connected. Starting server');
        rep = repo;

        // here we pass the ssl options to the server.js file
        return server.start({
            port: config.serverSettings.port,            
            ssl: config.serverSettings.ssl,
            repo
        });
        
    }).then(app => {
        console.log(`Server started successfully, running on port: ${config.serverSettings.port}.`);
        app.on('close', () => {
            rep.disconnect();
        });
    });
});

mediator.on('db.error', (err) => {
    console.error(err);
});

config.db.connect(config.dbSettings, mediator);

mediator.emit('boot.ready');
