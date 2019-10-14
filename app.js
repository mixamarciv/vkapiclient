'use strict';
const PORT = 80;
const log = require('wlog-js').init(__dirname + '/temp/log');

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);


require('./routers/vkapisocket.js').loadRoutes(io);

const sess = require('./routers/session.js');
io.use(function(socket, next) {
    sess.sessionParser(socket.request, {}, next);
});
sess.loadRoutes(app, log);
require('./routers/staticfiles.js').loadRoutes(app, log);

server.listen(PORT, function () {
    log.log('server listening on port ' + PORT);
});


process.on('uncaughtException', function (err) {
    log.log('================ uncaughtException ======================');
    log.var_dump("ERROR uncaughtException", err);
});
