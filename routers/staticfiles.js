const fs = require('fs');
const path = require('path');
const {sleep} = require('../fnc.js');

// тут просто отправка статичных файлов с выводом в лог что и когда запрашивали..
module.exports.loadRoutes = function (app, log) {
    app.get('*', send_file);
    async function send_file(req, res) {
        let file = req.originalUrl;  // относительный путь к файлу
        file = file.replace('\?.*$', ''); // удаляем все параметры
        let clientFilesPath = path.normalize(__dirname + '/../docs');

        let filePath = clientFilesPath + file;
        if (fs.existsSync(filePath)) {
            log.logf('file ok: ' + file);
            await sleep(200);
            return res.sendFile(filePath);
        }
        log.logf('file ERROR not found: ' + file);
        res.status(404).send('file not found: "' + filePath + '"');
    }
}
