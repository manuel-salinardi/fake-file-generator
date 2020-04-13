const {promisify} = require('util');
const fs = require('fs');

const fsPromise = {
    stat: promisify(fs.stat)
}

class FsPromise {
    static stat() {
        return promisify(fs.stat);
    }
}
FsPromise.access = promisify(fs.access);

module.exports = fsPromise;
