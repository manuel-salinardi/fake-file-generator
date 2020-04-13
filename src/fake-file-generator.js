const fs = require('fs');

const debug = require('debug')('fake-file-generator:main');

const FakeFileGeneratorError = require('./fake-file-generator-error');
const fsPromise = require('./fsPromise');


class FakeFileGenerator {
    static generateFile(filePath, size, options, callBack) {
        debug(`generateFile: filePath ${filePath}, size ${size}`);

        return Promise.resolve()
            .then(checkParameters)
            .then(generate)
            .catch(err => {
                debug(err);
                if (err instanceof FakeFileGeneratorError) {
                    console.error(`generateFile: ${err.message}`);
                } else {
                    console.error(`generateFile: unknown error`);
                }
            })

        function checkParameters() {
            if (!filePath) {
                throw new FakeFileGeneratorError(`missing required filePath parameter`);
            }
            if (typeof filePath !== 'string') {
                throw new FakeFileGeneratorError(`wrong type required filePath parameter, should be string, but found: ${typeof filePath}`);
            }
            if (size === 0) {
                throw new FakeFileGeneratorError(`size parameter cannot be 0`);
            }
            if (size !== 0 && typeof size !== 'undefined' && typeof size !== 'number') {
                throw new FakeFileGeneratorError(`wrong type size parameter, should be number, but found: ${typeof size}`);
            }
        }
        function generate() {
            return new Promise((resolve, reject) => {
                const buffer = Buffer.alloc(size);
                buffer.
                debugger
                const writableStream = fs.createWriteStream(filePath);

                console.log(writableStream.writableHighWaterMark)

                writableStream.on('error', reject);
                writableStream.on('pause', () => {
                    debug('stream paused')
                });
                writableStream.on('resume', () => {
                    debug('stream resumed')
                });
                writableStream.on('finish', () => {
                    debug('stream finished')
                });
                writableStream.on('close', () => {
                    debug('stream closed')
                });
                writableStream.on('drain', () => {
                    debug('stream drain')
                });
            })
        }
    }

    static generateFileSync() {

    }
}
module.exports = FakeFileGenerator;
