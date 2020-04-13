class Utils {
    static megabyteToByte(megabytes) {
        return megabytes * 1e+6;
    }
    static bytesToMegabytes(bytes) {
        return bytes / 1e-6;
    }
}

module.exports = Utils;
