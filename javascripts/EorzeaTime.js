function computeEorzeaDate(date) {
    const eorzeaTime = new Date();
    // if (typeof (date) == Number) {
    //     date = new Date(date);
    // }
    const unixTime = Math.floor(date.getTime() * (1440 / 70));
    eorzeaTime.setTime(unixTime);
    return eorzeaTime;
}

export default class EorzeaTime {
    date;

    constructor(date = new Date()) {
        this.date = computeEorzeaDate(date);
    }

    getHours() {
        return this.date.getUTCHours();
    }

    getMinutes() {
        return this.date.getUTCMinutes();
    }

    getSeconds() {
        return this.date.getUTCSeconds();
    }

    toString() {
        return [
            `0${this.getHours()}`.slice(-2),
            `0${this.getMinutes()}`.slice(-2),
            `0${this.getSeconds()}`.slice(-2),
        ].join(':');
    }

    toJSON() {
        return this.toString();
    }
}