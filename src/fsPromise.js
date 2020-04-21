const {promisify} = require('util');
const fs = require('fs');

const fsPromise = {
    stat: promisify(fs.stat),
    readFile: promisify(fs.readFile),
    unlink: promisify(fs.unlink),
    access: promisify(fs.access),
    readdir: promisify(fs.readdir),
}

class FsPromise {
    static stat() {
        return promisify(fs.stat);
    }
}
FsPromise.access = promisify(fs.access);

module.exports = fsPromise;
