const utils = {
    sp: (number: number | string): string => {
        const str = number.toString();
        if (+str >= 10000) {
            return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return str;
    },

    ssp: (number: number | string): string => {
        const str = number.toString();
        if (+str >= 10000) {
            return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }
        return str;
    },

    rn: (number: number, fixed: number = 0): string | null => {
        if (number === null) return null;
        if (number === 0) return '0';
        fixed = Math.max(fixed, 0);

        const [integer, exponent] = number.toPrecision(2).split('e');
        const k = exponent ? Math.floor(Math.min(+exponent.slice(1), 14) / 3) : 0;
        const suffix = ['', 'тыс', 'млн', 'млрд', 'трлн'][k];
        const result = k < 1 ? number.toFixed(fixed) : (number / Math.pow(10, k * 3)).toFixed(1 + fixed);

        return result.replace(/e/g, '').replace(/\+/g, '') + suffix;
    },

    gi: (number: number | string): string => {
        return number.toString().split('').map(digit => `${digit}⃣`).join('');
    },

    newgi: (number: number | string): string => {
        return number.toString().split('').join('');
    },

    decl: (n: number, titles: string[]): string => {
        return titles[
            (n % 10 === 1 && n % 100 !== 11) ? 0 :
                (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2
            ];
    },

    random: (x: number, y?: number): number => {
        return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
    },

    pick: <T>(array: T[]): T => {
        return array[utils.random(0, array.length - 1)];
    },

    calcWithDiscount(p: number, d: number) : number {
        if (!d || d <= 0) return p;
        const discount = 1.00 - (d / 100);
        return Math.floor(p * discount);
    }
};

export default utils;