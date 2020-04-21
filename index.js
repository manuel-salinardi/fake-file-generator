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

    // interactive mode
    if (args.length === 2) {

        (async function () {

            // file name
            console.log();
            console.log('insert file name. Ex: sound.mp3');
            let fileName = await Utils.readInputLine();
            fileName = fileName.trim();
            if (!fileName) {
                console.error(`missing required fileName parameter`);
                process.exit(1);
            }

            // size
            console.log();
            console.log('insert size (bytes). Ex: 1000');
            let size = await Utils.readInputLine();
            size = size.trim();
            if (!size) {
                console.error(`missing required size parameter`);
                process.exit(1);
            }

            // type
            console.log();
            console.log('insert type (available: txt). press enter for default generic not typed file');
            let type = await Utils.readInputLine();
            type = type.trim();

            console.log();

            debug('fileName', fileName);
            debug('size', size);
            debug('type', type);

            makeFileCli(fileName, size, type);
        })()

    } else {
        const fileName = Utils.getProgramArg(args, '--fileName', '-f');
        const size = Utils.getProgramArg(args, '--size', '-s');
        const type = Utils.getProgramArg(args, '--type', '-t');

        debug('fileName', fileName);
        debug('size', size);
        debug('type', type);

        if (!fileName) {
            console.error(`missing required fileName parameter`);
            process.exit(1);
        }

        if (!size) {
            console.error(`missing required size parameter`);
            process.exit(1);
        }

        makeFileCli(fileName, size, type);
    }

    function makeFileCli(fileName, size, type) {
        console.log('creating file...');
        console.time('program');
        FakeFileGenerator.makeFile(fileName, Number(size), {type})
            .then(() => {
                console.timeEnd('program');
                console.log('DONE!');
                process.exit(0);
            })
            .catch((err) => {
                debug(err);
                console.error(err.message);
                process.exit(1);
            })
    }
}





