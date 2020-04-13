const fs = require('fs');
const buffer = require('buffer');
const os = require('os');

// the max integer value that Buffer.alloc(size) supports
const bufferMaxLength = buffer.constants.MAX_LENGTH;

const debug = require('debug')('fake-file-generator:main');

const FakeFileGeneratorError = require('./fake-file-generator-error');

class FakeFileGenerator {
    static generateFile(filePath, size, options = {}, callBack) {
        const self = this;
        debug(`generateFile: filePath ${filePath}, size ${size}, options: ${JSON.stringify(options)}`);
        debug(`os.totalmem(), ${os.freemem()}`);

        return Promise.resolve()
            .then(checkParameters)
            .then(checkOptions)
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
            if (size > bufferMaxLength) {
                debug(`size parameter > bufferMaxLength. size: ${size}, bufferMaxLength: ${bufferMaxLength}`);
            }
            const availableSystemSpace = os.freemem();
            if (size >= availableSystemSpace) {
                throw new FakeFileGeneratorError(`wrong value size parameter, you dont have enough space in your system. size: ${size}, available space: ${availableSystemSpace}`);
            }
        }
        function checkOptions() {
            if (options.type && options.type !== 'txt') {
                throw new FakeFileGeneratorError(`unknown file type: ${options.type}`);
            }
        }
        function generate() {
            return new Promise((resolve, reject) => {
                const writableStream = fs.createWriteStream(filePath, {emitClose: true});

                writableStream.on('error', reject);
                writableStream.on('pause', () => debug('stream paused'));
                writableStream.on('resume', () => debug('stream resumed'));
                writableStream.on('finish', () => {
                    debug('stream finished');
                    writableStream.destroy();
                });
                writableStream.on('close', () => {
                    debug('stream closed')
                    resolve();
                });

                const highWaterMark = writableStream.writableHighWaterMark;

                if (size <= highWaterMark) {
                    writableStream.write(Buffer.alloc(size));
                    writableStream.end();
                } else {
                    let chunksNumbersToWrite = Math.floor(size / highWaterMark);
                    const restBytes = size % highWaterMark;

                    debug('highWaterMark', highWaterMark);
                    debug('chunksNumbersToWrite', chunksNumbersToWrite);
                    debug('restBytes', restBytes);

                    writableStream.on('drain', () => {
                        if (chunksNumbersToWrite > 0) {
                            writableStream.write(self.getBuffer(options.type, highWaterMark));
                            chunksNumbersToWrite--;
                        } else {
                            if (restBytes) {
                                writableStream.write(self.getBuffer(options.type, restBytes));
                            }
                            writableStream.end();
                        }
                    });
                    writableStream.write(self.getBuffer(options.type, highWaterMark));
                    chunksNumbersToWrite--;
                }
            })
        }
    }

    static getBuffer(type, size) {
        if (!type) {
            return Buffer.alloc(size);
        }
        if (type === 'txt') {
            return Buffer.alloc(size).fill('abcdefghilmnopqrstuvz');
        }
    }

    static generateFileSync() {

    }
}
module.exports = FakeFileGenerator;
