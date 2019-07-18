module.exports = {
    initTitle (title) {
        const arr = title.split(':');
        if (!arr[1]) return title;
        const rank = parseInt(arr[1].split('')[1]);
        const rankSign = '#';
        return `\n${rankSign.repeat(rank + 1)} ${arr[0]}\n\n`;
    },
    isTitle (str) {
        const arr = str.split(':');
        const titleReg = /^h[1-5]/;
        return arr[1] && titleReg.test(arr[1]);
    },
    jusgeTitleRank (rank, str) {
        const arr = str.split(':');
        if (arr[1]) {
            return rank - parseInt(arr[1].split('')[1]) - 1;
        }

        return true;
    },
    getTitleRank (str) {
        const arr = str.split(':');
        if (arr[1]) {
            return parseInt(arr[1].split('')[1]) + 1;
        }

        return 0;
    }
}