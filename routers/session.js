let log = require('wlog-js');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let urlParser = bodyParser.urlencoded({ extended: false })

let moment = require('moment');

let session = require('express-session');
let sessionstore = require('sessionstore');
const minAgeSession = 60 * 1000 * 90; // 90 минут
let sessionParser = session({
    secret: 'secreKey3000',
    name: 'auth',
    store: sessionstore.createSessionStore(),
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: minAgeSession },
});

async function statRequestStart(req, res, next) {
    //log.var_dump("req.query", req.query, { depth: 1 });
    //log.var_dump("req.body", req.body, { depth: 1 });
    //log.var_dump("req", req, { depth: 1 });
    //log.var_dump("req.param", req.param('login'),{depth:1});
    //await sleep(5000);
    req.startLoading = new Date().getTime();
    //await sleep(1000);
    next();
}

async function statRequestEnd(req, res, next) {
    let views = 0;
    if (req.session) {
        if (!req.session.views) req.session.views = 0;
        req.session.views++;
        views = req.session.views;
    }
    views = String(views).padStart(4, '    ');

    let time = new Date().getTime() - req.startLoading;
    let duration = moment.utc(time).format("ss.SSS");

    // выводит в лог инфо о запросе
    log.logf('req:' + views + '    ' + duration + '  ' + req.originalUrl);
    if (next) next();
}

const statBeg = statRequestStart;
const statEnd = statRequestEnd;

async function addStatInfo(req, res, ret) {
    ret.user = req.session.user;
    ret.views = req.session.views;  // количество загрузок данных для страниц
    ret.sessMaxAge = req.session.cookie.maxAge;
    ret.sessMinAge = minAgeSession;
    ret.lastServerTime = new Date().getTime();
}

async function loginUser(req, res, next) {
    let d = req.body;
    let ret = {};
    let user = await authUser(d);

    if (!user.error) { // если юзер авторизовался успешно
        req.session.user = user; // список авторизованных юзеров
        ret.user = user;
    } else if (user.error) {
        ret = user; 
    }

    addStatInfo(req, res, ret);
    res.send(ret);
    next();
}

async function logoutUser(req, res, next) {
    let d = req.body;
    let ret = { result: 'not auth' };


    if (req.session && req.session.user) {
        req.session.user = 0;
        ret = { result: 'ok' };
    }

    addStatInfo(req, res, ret);
    res.send(ret);
    next();
}


// просто отправляет статистику клиенту
async function sessStatus(req, res, next) {
    let ret = {};
    addStatInfo(req, res, ret);
    res.send(ret);
    next();
}

//тут будет функция обработки авторизации
async function authUser(d) {
    let ret = {error:{ errcode: 'AUTH0', message: 'не верный логин/пароль' }};
    if (/admin/i.test(d.login) && /123/.test(d.pass)) {
        ret = { type: 'admin', name: 'Администратор',login: d.login, id: 1000 };
    }
    if (/dima/i.test(d.login) && /123456/.test(d.pass)) {
        ret = { type: 'admin', name: 'Администратор',login: d.login, id: 1000 };
    }
    return ret;
}

module.exports.sessionParser = sessionParser;
module.exports.loadRoutes = function (app, plog) {
    log = plog;
    app.set('trust proxy', 1) // trust first proxy

    app.post('/status', statBeg, sessionParser, sessStatus, statEnd);
    app.post('/login', statBeg, jsonParser, urlParser, sessionParser, loginUser, statEnd);
    app.post('/logout', statBeg, jsonParser, urlParser, sessionParser, logoutUser, statEnd);
}
