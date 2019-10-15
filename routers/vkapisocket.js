const { PORT_VKAPISOCKET } = require('../config.js');

const moment = require('moment');
const log = require('wlog-js');
const { writeJSONFileAsync, readJSONFileAsync, sleep, isFunction } = require('../fnc.js');


const rulesFile = __dirname + '/../data/rules.json';
const vkdataFile = __dirname + '/../data/vkdata.json';

let rules = [
    { tag: 'tag1', value: 'титов -егор' },
    { tag: 'tag2', value: 'собчак' },
    { tag: 'tag3', value: 'навальный' },
    { tag: 'tag4', value: 'путин' },
    { tag: 'tag5', value: 'жириновский' },
    { tag: 'tag6', value: 'явлинский' },
    { tag: 'tag7', value: 'грудинин' }
];
let vkdata = [];
async function initLoad() {
    rules = await readJSONFileAsync(rulesFile, rules);
    log.log('init load rules:');
    log.logf(rules);

    vkdata = await readJSONFileAsync(vkdataFile, vkdata);
    log.log('init load vkdata: ' + vkdata.length);

    await updateRules();
}


let io = 0;
const ioclient = require('socket.io-client');

const kill = require('tree-kill');
function killAsync(pid) { return new Promise((resolve) => kill(pid, resolve)); }
const { spawn } = require('child_process');


let childPrc = 0;
let vksocket = 0;
async function updateRules() {
    log.log('updateRules() start');
    if (childPrc) {
        log.logf('kill pid: ' + childPrc.pid);
        await killAsync(childPrc.pid);
        await sleep(1000);
    }
    childPrc = spawn('node', ['app_vkapisocket.js']);
    if (!!vksocket) return;
    // socket.io-client - один раз устанавливает соединение и далее только 
    //   восстанавливает его в случае необходимости, поэтому объявляем функции-обработчики только один раз
    vksocket = ioclient('http://127.0.0.1:' + PORT_VKAPISOCKET);
    vksocket.on('connect', function () {
        vksocket.emit('rules', rules);
    });
    vksocket.on('data', function (data) {
        log.logf(data);
        if (io) io.emit('data', data);
        addVkdata(data);
    });
    vksocket.on('error', function (err) {
        log.logf('vksocket.on("error")!!!!!');
        log.logf(err);
    });
    vksocket.on('postRulesEnd', function () {
        log.log('updateRules() end');
    });
}

async function addVkdata(d) {
    vkdata.unshift(d);
    if (vkdata.length > 1000) vkdata.pop(); // удаляем последний элемент
    await writeJSONFileAsync(vkdataFile, vkdata);
    io.emit('vkdata', vkdata);
}

module.exports.loadRoutes = function (socketio) {
    initLoad();
    io = socketio;
    io.on('connection', socket => {
        log.logf('client connect');
        log.logf(socket.request.session);

        let u = socket.request.session.user;
        if (!u || u.login != 'dima') { // если юзер не авторизован и не dima
            log.logf('client socket.disconnect()!!!');
            return socket.disconnect();
        }

        socket.on('getrules', () => sendRules(socket));
        socket.on('getvkdata', () => sendVkdata(socket));
        socket.on('newrules', (newrules) => newRules(socket, newrules));
    });
}

async function sendRules(socket) {
    socket.emit('rules', rules);
}

async function sendVkdata(socket) {
    socket.emit('vkdata', vkdata);
}

async function newRules(socket, newrules) {
    log.logf('newRules:');
    rules = newrules;
    await writeJSONFileAsync(rulesFile, rules);
    await updateRules();
}
