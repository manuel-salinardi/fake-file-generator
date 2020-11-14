const buffer = require('buffer');
const Utils = require('./utils');
const Txt = require('./file-types/txt');
const NoType = require('./file-types/no-type');

// the max integer value that Buffer.alloc(size) supports
const bufferMaxLength = buffer.constants.MAX_LENGTH;

const debug = Utils.getDebugModuleOrMock('fake-file-generator:main');

const FakeFileGeneratorError = require('./fake-file-generator-error');

class FakeFileGenerator {

    static makeFile(filePath, size, options = {}) {
        debug(`makeFile: filePath ${filePath}, size ${Utils.formatNumber(size)}, options: ${JSON.stringify(options)}`);

        return Promise.resolve()
            .then(checkParameters)
            .then(checkOptions)
            .then(generate)

        function checkParameters() {
            if (!filePath) {
                throw new FakeFileGeneratorError(`missing required filePath parameter`);
            }
            if (typeof filePath !== 'string') {
                throw new FakeFileGeneratorError(`wrong type required filePath parameter, should be string, but found: ${typeof filePath}`);
            }
            if (size <= 0) {
                throw new FakeFileGeneratorError(`size parameter cannot be equal or less than 0`);
            }
            if (typeof size !== 'number' || isNaN(size)) {
                throw new FakeFileGeneratorError(`wrong type size parameter, invalid number: ${size}`);
            }
            if (size > bufferMaxLength) {
                debug(`size parameter > bufferMaxLength. size: ${Utils.formatNumber(size)}, bufferMaxLength: ${Utils.formatNumber(bufferMaxLength)}`);
            }
        }
        function checkOptions() {
            if (options.type && options.type !== 'txt') {
                throw new FakeFileGeneratorError(`unknown file type: ${options.type}`);
            }
        }
        function generate() {
            let objectFileType;

            switch (options.type) {
                case 'txt': objectFileType = new Txt(); break;
                default: objectFileType = new NoType();
            }

            return objectFileType.makeFile(filePath, size);
        }
    }
}
module.exports = FakeFileGenerator;
