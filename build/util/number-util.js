"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberUtil = void 0;
class NumberUtil {
    static format(num, digits) {
        if (num === Infinity)
            return '∞';
        const si = [
            {
                value: 1,
                symbol: '',
            },
            {
                value: 1E3,
                symbol: 'K',
            },
            {
                value: 1E6,
                symbol: 'M',
            },
            {
                value: 1E9,
                symbol: 'B',
            },
            {
                value: 1E12,
                symbol: 't',
            },
            {
                value: 1E15,
                symbol: 'q',
            },
            {
                value: 1E18,
                symbol: 'Q',
            },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    }
}
exports.NumberUtil = NumberUtil;
//# sourceMappingURL=number-util.js.map