const debug = require('debug')('fake-file-generator:index');

const Utils = require('./src/utils');

// --fileName | -f
// --size | -s
// --output | -o
// --type | -t

const FakeFileGenerator = require('./src/fake-file-generator');

// if called from required
if (require.main !== module) {
    module.exports = FakeFileGenerator;

// if called from cli
} else {
    const args = process.argv;
    debug('process.argv', args);
    const outputFilePath = Utils.getProgramArg(args, '--fileName', '-f');
    const size = Utils.getProgramArg(args, '--size', '-s');

    debug('fileName', outputFilePath);
    debug('size', size);

    console.log('creating file...');
    console.time('program');
    FakeFileGenerator.makeFile(outputFilePath, Number(size))
        .then(() => {
            console.timeEnd('program');
            console.log('DONE!');
        })
        .catch(console.error)
}





