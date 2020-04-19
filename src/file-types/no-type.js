const fs = require('fs');
const debug = require('debug')('fake-file-generator:no-type');

class NoType {

    makeFile(outputFilePath, size) {
        return new Promise((resolve, reject) => {
            const writableStream = fs.createWriteStream(outputFilePath, {emitClose: true, autoClose: true});

            writableStream.on('error', reject);
            writableStream.on('pause', () => debug('stream paused'));
            writableStream.on('resume', () => debug('stream resumed'));
            writableStream.on('finish', () => debug('stream finished'));

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
                        writableStream.write(this.getBuffer(highWaterMark));
                        chunksNumbersToWrite--;
                    } else {
                        if (restBytes) {
                            writableStream.write(this.getBuffer(restBytes));
                        }
                        writableStream.end();
                    }
                });
                writableStream.write(this.getBuffer(highWaterMark));
                chunksNumbersToWrite--;
            }
        })
    }

    getBuffer(size) {
        return Buffer.alloc(size);
    }
}
module.exports = NoType;
