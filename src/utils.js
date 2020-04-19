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
}

module.exports = Utils;
