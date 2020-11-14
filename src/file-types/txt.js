const fs = require('fs');
const Utils = require('../utils');

const debug = Utils.getDebugModuleOrMock('fake-file-generator:txt');

const START_FILE_MARK = 'START-->';
const END_FILE_MARK = '<--END';
const FILL_PATTERN = 'abcdefghilmnopqrstuvz';

class Txt {

    makeFile(outputFilePath, size) {
        return new Promise((resolve, reject) => {
            const writableStream = fs.createWriteStream(outputFilePath, {emitClose: true, autoClose: true});

            writableStream.on('error', (err) => {
                reject(err);
                debug(err);
            });
            writableStream.on('pause', () => debug('stream paused'));
            writableStream.on('resume', () => debug('stream resumed'));
            writableStream.on('finish', () => debug('stream finished'));
            writableStream.on('close', () => {
                debug('stream closed')
                resolve();
            });

            const highWaterMark = writableStream.writableHighWaterMark;

            // write all file in one time
            if (size <= highWaterMark) {
                this.writeStartAndEndFile(writableStream, size);
            } else {
                let chunksNumbersToWrite = Math.floor(size / highWaterMark);
                const restBytes = size % highWaterMark;

                debug('highWaterMark', highWaterMark);
                debug('chunksNumbersToWrite', chunksNumbersToWrite);
                debug('restBytes', restBytes);

                writableStream.on('drain', () => {
                    if (chunksNumbersToWrite > 0) {
                        chunksNumbersToWrite--;

                        // last chunk
                        if (chunksNumbersToWrite === 0) {
                            if (restBytes === 0) {
                                this.writeEndFile(writableStream, highWaterMark);
                            } else {
                                this.writeEndFile(writableStream, highWaterMark + restBytes);
                                writableStream.end();
                            }
                        } else {
                            writableStream.write(this.getFillBuffer(highWaterMark));
                        }
                    } else {
                        if (restBytes) {
                            this.writeEndFile(writableStream, restBytes);
                        }
                        writableStream.end();
                    }
                });

                // first write fire drain event
                this.writeStartFile(writableStream, highWaterMark);
                chunksNumbersToWrite--;
            }
        })
    }

    writeStartAndEndFile(writableStream, size) {
        const startFileMarkerBuffer = Buffer.from(START_FILE_MARK);
        const endFileMarkerBuffer = Buffer.from(END_FILE_MARK);

        const fillBufferLength = size - Buffer.byteLength(startFileMarkerBuffer) - Buffer.byteLength(endFileMarkerBuffer);

        // if the buffer is smaller than START--><--END
        if (fillBufferLength <= 0) {
            const fillBufferLength = size - Buffer.byteLength(startFileMarkerBuffer);

            // if the buffer is smaller than START-->
            if (fillBufferLength <= 0) {
                const fillBuffer = Buffer.alloc(size, startFileMarkerBuffer);
                writableStream.write(fillBuffer);
                writableStream.end();
                return;
            }
            const fillBuffer = Buffer.alloc(fillBufferLength, this.getFillBuffer(fillBufferLength));
            const contentBuffer = Buffer.concat([startFileMarkerBuffer, fillBuffer]);
            writableStream.write(contentBuffer);
            writableStream.end();
            return;
        }

        const fillBuffer = Buffer.alloc(fillBufferLength, this.getFillBuffer(fillBufferLength));
        const contentBuffer = Buffer.concat([startFileMarkerBuffer, fillBuffer, endFileMarkerBuffer]);

        writableStream.write(contentBuffer);
        writableStream.end();
    }

    writeStartFile(writableStream, highWaterMark) {
        const startFileMarkerBuffer = Buffer.from(START_FILE_MARK);
        const fillBuffer = this.getFillBuffer(highWaterMark - Buffer.byteLength(startFileMarkerBuffer));
        const concatBuffer = Buffer.concat([startFileMarkerBuffer, fillBuffer]);
        writableStream.write(concatBuffer);
    }

    writeEndFile(writableStream, restBytes) {
        const endFileMarkerBuffer = Buffer.from(END_FILE_MARK);
        const bufferLengthDiff = restBytes - Buffer.byteLength(endFileMarkerBuffer);
        const absoluteDiff = Math.abs(bufferLengthDiff);
        const fillBuffer = this.getFillBuffer(absoluteDiff);
        const concatBuffer = Buffer.concat([fillBuffer, endFileMarkerBuffer]);
        writableStream.write(concatBuffer);
    }

    getFillBuffer(size) {
        return Buffer.alloc(size, FILL_PATTERN);
    }
}
module.exports = Txt;
