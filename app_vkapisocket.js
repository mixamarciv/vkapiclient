const { VK_SERVICE_KEY, PORT_VKAPISOCKET } = require('./config.js');
const moment = require('moment');
const log = require('wlog-js').init(__dirname + '/temp/log_vkapisocket');;
const { sleep, isFunction } = require('./fnc.js');

const VKWebSocket = require('vkflow').VKWebSocket;
const { authWithToken, flushRules, postRule } = require('vkflow').VKStreamingAPI;

let rules = [];
let vksocket = 0;
let mainKey, mainEndpoint;


let io = require('socket.io')(PORT_VKAPISOCKET);
log.log('socket.io listen port: ' + PORT_VKAPISOCKET);

io.on('connection', function (socket) {
    log.log('client connection..');
    socket.on('rules', async function (rules) {
        log.log('client on rules');
        log.logf(rules);
        await updateRules(rules);
    });

    socket.on('disconnect', function () {
        log.log('client on disconnect');
    });
});


async function updateRules(newRules) {
    try {
        try {
            const { endpoint, key } = await authWithToken(VK_SERVICE_KEY);
            mainEndpoint = endpoint;
            mainKey = key;
        } catch (error) {
            log.logf(error);
            return;
        }

        log.log('vk endpoint: ' + mainEndpoint);
        log.log('vk key: ' + mainKey);

        await flushRules(mainEndpoint, mainKey);
        if (io) io.emit('flushRules');
        log.log('flush rules');

        rules = newRules;
        for (let i in rules) {
            let rule = rules[i];
            await postRule(mainEndpoint, mainKey, { rule });
            if (io) io.emit('postRule', { rule: rule, i: i });
            log.log('end post rule' + i);
        }
        if (io) io.emit('postRulesEnd');
        log.log('end post all rules');

        vksocket = new VKWebSocket(
            `wss://${mainEndpoint}/stream?key=${mainKey}`,
            { socket: { omitServiceMessages: false } }
        )

        vksocket.on('data', function (data) {
            let d = parseData(data);
            log.logf(d);
            if (io) io.emit('data', d);
        });

        vksocket.on('error', function (err) {
            log.logf('vksocket.on("error")!!!!!');
            log.logf(err);
            io.emit('error', err);
        });

    } catch (error) {
        console.log(error);
    }
}

//------------------------------------------------------
function parseData(data) {
    let d = {};
    try {
        data = JSON.parse(data);
    } catch (error) {
        d.error = error;
        return d;
    }

    if (!data.event) {
        d.error = {};
        d.error.message = 'no data.event';
        d.jsondata = data;
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

