class Utils {
    static megabyteToByte(megabytes) {
        return megabytes * 1e+6;
    }
    static bytesToMegabytes(bytes) {
        return bytes / 1e-6;
    }
    static formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    static getProgramArg(args, extended, short) {
        const argIndex = args.findIndex((arg) => arg === extended || arg === short);
        let argValue = '';
        if (argIndex !== -1) {
            argValue = args[argIndex+1];
        }
        return argValue;
    }
}

module.exports = Utils;
