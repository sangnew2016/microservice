const dbSettings = {
    db: process.env.DB || 'sv_cinemas',
    user: process.env.DB_USER || 'admin',
    pass: process.env.DB_PASS || '123456789',
    repl: process.env.DB_REPLS || 'rs1',
    servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.substr(1, process.env.DB_SERVERS.length - 2).split(' ') : [
        //'172.14.0.2:27017',
        //'172.14.0.3:27017',
        '172.17.0.2:27017'
    ],
    dbParameters: () => ({
        w: 'majority',
        wtimeout: 10000,
        j: true,
        readPreference: 'ReadPreference.SECONDARY_PREFERRED',
        native_parser: false
    }),
    serverParameters: () => ({
        autoReconnect: true,
        poolSize: 10,
        socketoptions: {
          keepAlive: 300,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 30000
        }
    }),
    replsetParameters: (replset = 'rs1') => ({
        replicaSet: replset,
        ha: true,
        haInterval: 10000,
        poolSize: 10,
        socketoptions: {
          keepAlive: 300,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 30000
        }
    })
};

const serverSettings = {
    port: process.env.port || 3000,
    ssl: require('./ssl')
};

module.exports = Object.assign({}, {dbSettings, serverSettings});
