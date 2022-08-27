/**
 * エリアの定義
 */
export const ZONE_SANCTUARY_ISLAND = 'sanctuaryIsland';

/**
 * 天気の定義
 */
export const WEATHER_CLEAR_SKIES = 'clearSkies';
export const WEATHER_FAIR_SKIES = 'fairSkies';
export const WEATHER_CLOUDS = 'clouds';
export const WEATHER_RAIN = 'rain';
export const WEATHER_FOG = 'fog';
export const WEATHER_SHOWERS = 'showers';

/**
 * chance計算
 */
function calculateForecastTarget(date) {
    const unixtime = Math.floor(date.getTime() / 1000);
    // Get Eorzea hour for weather start
    const bell = unixtime / 175;

    // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
    const increment = (bell + 8 - (bell % 8)) % 24;

    // Take Eorzea days since unix epoch
    let totalDays = unixtime / 4200;
    totalDays = (totalDays << 32) >>> 0; // eslint-disable-line no-bitwise

    const calcBase = totalDays * 0x64 + increment;

    /* eslint-disable no-bitwise */
    const step1 = ((calcBase << 0xb) ^ calcBase) >>> 0;
    const step2 = ((step1 >>> 8) ^ step1) >>> 0;
    /* eslint-enable no-bitwise */

    return step2 % 0x64;
};

const sanctuaryIsland = function (chance) {
    if (chance < 25) {
        // 快晴
        return WEATHER_CLEAR_SKIES;
    }
    if (chance < 70) {
        // 晴れ
        return WEATHER_FAIR_SKIES;
    }
    if (chance < 80) {
        // 曇り
        return WEATHER_CLOUDS;
    }
    if (chance < 90) {
        //雨
        return WEATHER_RAIN;
    }
    if (chance < 95) {
        //霧
        return WEATHER_FOG;
    }
    //暴雨
    return WEATHER_SHOWERS;
};

export const localeJa = {
    'weathers.clearSkies': '快晴',
    'weathers.fairSkies': '晴れ',
    'weathers.clouds': '曇り',
    'weathers.rain': '雨',
    'weathers.fog': '霧',
    'weathers.showers': '暴雨',
    'zones.sanctuaryIsland': '名もなき島',
};

const chances = {};
chances[ZONE_SANCTUARY_ISLAND] = sanctuaryIsland;

export class SanctuaryIslanndWeather {
    id;
    constructor(id) {
        this.id = id;
    }
    getWeather(_date) {
        const chance = calculateForecastTarget(_date);
        const weatherId = chances[this.id](chance);
        return localeJa["weathers." + weatherId];
    }

    static getWeather(_id, _date) {
        return new SanctuaryIslanndWeather(_id).getWeather(_date);
    }
} 