const { VK_SERVICE_KEY } = require('../config.js');

const moment = require('moment');
const log = require('wlog-js');
const { writeJSONFileAsync, readJSONFileAsync } = require('../fnc.js');

const VKWebSocket = require('vkflow').VKWebSocket;
const { authWithToken, flushRules, postRule } = require('vkflow').VKStreamingAPI;

const rulesFile = __dirname + '/../data/rules.json';
const vkdataFile = __dirname + '/../data/vkdata.json';
let rules = [
    { tag: 'candidate1', value: 'титов -егор' },
    { tag: 'candidate2', value: 'собчак' },
    { tag: 'candidate3', value: 'навальный' },
    { tag: 'candidate4', value: 'путин' },
    { tag: 'candidate5', value: 'жириновский' },
    { tag: 'candidate6', value: 'явлинский' },
    { tag: 'candidate7', value: 'грудинин' }
];
let vkdata = [];
let mainKey, mainEndpoint;
let io = 0;

async function initLoad() {
    try {
        const { endpoint, key } = await authWithToken(VK_SERVICE_KEY);
        mainEndpoint = endpoint;
        mainKey = key;
    } catch (error) {
        console.log(error);
    }

    log.log('vk endpoint: ' + mainEndpoint);
    log.log('vk key: ' + mainKey);


    rules = await readJSONFileAsync(rulesFile, rules);
    log.log('init load rules:');
    log.logf(rules);

    vkdata = await readJSONFileAsync(vkdataFile, vkdata);
    log.log('init load vkdata: ' + vkdata.length);

    await updateRules();
}

async function updateRules() {
    if (!mainEndpoint) return;
    try {
        await flushRules(mainEndpoint, mainKey);
        if (io) io.emit('flushRules');
	log.log('flush rules');

        for (let rule of rules) {
            await postRule(mainEndpoint, mainKey, { rule });
            if (io) io.emit('postRule', rule);
        }
        if (io) io.emit('postRulesEnd');
	log.log('post all rules');

        const vksocket = new VKWebSocket(
            `wss://${mainEndpoint}/stream?key=${mainKey}`,
            { socket: { omitServiceMessages: false } }
        )
        vksocket.on('data', function (data) {
            let d = parseData(data);
            log.logf(d);
            if (io) io.emit('data', d);
            addVkdata(d);
        });

        vksocket.on('error', function (err) {
            log.logf(err);
        });
    } catch (error) {
        console.log(error);
    }
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
            log.logf('socket.disconnect()!!!');
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

//------------------------------------------------------
function parseData(data) {
    let d = {};
    try {
        data = JSON.parse(data);
    } catch (error) {
        d.error = error.message;
        return d;
    }

    d.date = moment(data.event.creation_time * 1000).format("YYYY.MM.DD HH:mm:ss");
    d.type = data.event.event_type;
    d.url = data.event.event_url;
    d.url_author = data.event.author.author_url;
    d.tags = parseTags(data.event.tags);
    d.text = clearText(data.event.text);

    if (data.event.attachments) {
        d.attachments = [];
        for (let i in data.event.attachments) {
            let attach = parseAttach(d, data.event.attachments[i]);
            d.attachments.push(attach);
        }
    }
    //d.attachmentsJSON = JSON.stringify(d.event.attachments, null, "\t");
    //d.attachmentsJSON2 = JSON.stringify(d.attachments, null, "\t");
    return d;
}

function parseTags(tags) {
    let a = [];
    for (let i in rules) {
        let rule = rules[i];
        if (tags.indexOf(rule.tag) >= 0) a.push(rule.value);
    }
    return a;
}

function parseAttach(d, attach) {
    let type = attach.type;
    let a = attach[type];
    let p = {};
    p.type = type;
    if (a.date) p.date = moment(a.date * 1000).format("YYYY.MM.DD HH:mm:ss");
    else p.date = d.date;
    p.title = a.title;
    p.description = a.description;
    p.url = a.url;
    if (!p.url) p.url = d.url;
    p.img = getPhoto(a);
    return p;
}

function getPhoto(a) {
    let photoUrl = "";
    let maxn = 0;
    for (let key in a) {
        if (/photo_/i.test(key)) {
            let n = parseInt(key.replace(/photo_/, ""), 10);
            if (n > maxn) {
                maxn = n;
                photoUrl = a[key];
            }
        }
    }
    if (photoUrl) return photoUrl;
    let b = a.photo;
    maxn = 0;
    for (let key in b) {
        if (/photo_/i.test(key)) {
            let n = parseInt(key.replace(/photo_/i, ""), 10);
            if (n > maxn) {
                maxn = n;
                photoUrl = b[key];
            }
        }
    }
    return photoUrl;
}

function clearText(text) {
    let len = text.length;
    if (!len) return "";
    text = text.replace(/<br>[ \n\r\t]*<br>/gi, "<br>");
    while (len != text.length) {
        len = text.length;
        text = text.replace(/<br>[ \n\r\t]*<br>/gi, "<br>");
    }
    return text;
}

