const util = require('util');
const fs = require('fs');

class FsPromise {
    static access() {
        return util.promisify(fs.access);
    }
}

module.exports = FsPromise;
