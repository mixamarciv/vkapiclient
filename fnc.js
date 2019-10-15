
module.exports.sleep = function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

module.exports.getRandomInt = function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


const fs = require('fs');

function writeJSONFile(file, obj, callback) {
    const jsonString = JSON.stringify(obj, null, '\t');
    fs.writeFile(file, jsonString, err => {
        if (err) console.log(err);
        callback(err);
    });
}

function readJSONFile(file, defaultData, callback) {
    fs.readFile(file, 'utf8', (err, jsonString) => {
        if (err) return writeJSONFile(file, defaultData, () => callback(defaultData));
        let data = {};
        try {
            data = JSON.parse(jsonString);
        } catch (err) {
            console.log(err);
            return writeJSONFile(file, defaultData, () => callback(defaultData));
        }
        callback(data);
    });
}

function writeJSONFileAsync(file, obj) {
    return new Promise((resolve) => writeJSONFile(file, obj, resolve));
}
function readJSONFileAsync(file, defaultData) {
    return new Promise((resolve) => readJSONFile(file, defaultData, resolve));
}
module.exports.writeJSONFile = writeJSONFile;
module.exports.readJSONFile = readJSONFile;
module.exports.writeJSONFileAsync = writeJSONFileAsync;
module.exports.readJSONFileAsync = readJSONFileAsync;

