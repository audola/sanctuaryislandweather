import * as siw from './SanctuaryIslanndWeather.js';
import { default as EorzeaTime } from './EorzeaTime.js';

let allItem = [];
let localTimeElement = null;
let eorzeaTimeElement = null;
/*
let allWeatherItem = [
    {
        id: 1,
        name: "快晴",
    },
    {
        id: 2,
        name: "晴れ",
    },
    {
        id: 3,
        name: "曇り",
    },
    {
        id: 4,
        name: "霧",
    },
    {
        id: 7,
        name: "雨",
    },
    {
        id: 8,
        name: "暴雨",
    },
];
*/
let initTR = "";


// 実行開始
main();

function main() {
    localTimeElement = document.getElementById("localTime");
    eorzeaTimeElement = document.getElementById("eorzeaTime");

    allItem = createItems();
    initTR = document.getElementById("initTR");

    process();
    updateTime();
    
    setInterval(updateTime,500);
    // setInterval(process, 20 * 1000);
}

function createItems() {
    const ET_ONE_HOUR = 175 * 1000;
    const ET_EIGHT_HOUR = ET_ONE_HOUR * 8;
    // const ET_ONE_DAY = ET_ONE_HOUR * 24;

    var startDate = null;
    var reportNum = 72;
    let result = [];

    for (var i = 0; i < reportNum; i++) {
        if (startDate == null) {
            startDate = new Date(getStartTime(new Date()));

        } else {
            startDate = new Date(startDate.getTime() + ET_EIGHT_HOUR)
        }

        let et = getET(startDate);
        let tmpElem = {};

        tmpElem["lt"] = startDate.getTime();
        tmpElem["et"] = et;
        tmpElem["weather"] = siw.SanctuaryIslanndWeather.getWeather(siw.ZONE_SANCTUARY_ISLAND, startDate);
        tmpElem["dayornight1"] = getDayOrNight(et.getHours(), 0);
        tmpElem["dayornight2"] = getDayOrNight(et.getHours(), 1);
        result.push(tmpElem);
    }

    return result;
}

function process() {
    const dataTable = document.getElementById("weatherTable");
    let tmpTableInnerHTMLTag = "";

    let currentDate = new Date();

    for (let i = 0; i < allItem.length; i++) {
        const elem = allItem[i];

        const tmpDate = new Date(elem.lt);

        // let weatherId = getWeatherIdByName(elem.weather);
        let weatherCellClass = "weatherCell";

        let timeProcessStyle = "";
        let currentTimeProcessDivTag = "";

        if (currentDate.getTime() < elem.lt) {
            timeProcessStyle = "timeprocessFuture";
        } else if ((currentDate.getTime() >= elem.lt) && (currentDate.getTime() < (elem.lt + 23 * 60 * 1000 + 20 * 1000))) {
            timeProcessStyle = "timeprocessCurrent";
            currentTimeProcessDivTag = "<div id='currentPassed'>&nbsp;</div><div id='currentFuture'>&nbsp;</div>";
        } else {
            timeProcessStyle = "timeprocessPassed";
        }

        let additionalStyleList = [];
        if (i % 3 == 2) {
            additionalStyleList.push("border-bottom:2px #666 dashed");
        }
        if (i % 3 == 1) {
            // additionalStyleList.push("padding-top:0em; padding-bottom:0em");
        }
        if (currentDate.getTime() > (elem.lt + 23 * 60 * 1000 + 20 * 1000)) {
            additionalStyleList.push("background-color:#BBBBBB");

        }

        let additionalStyleTag = "";
        additionalStyleList.forEach(addStyle => {
            additionalStyleTag += addStyle + ";";
        });
        additionalStyleTag = " style='" + additionalStyleTag + "'";

        // console.log("elem", elem);
        // console.log("elem.et", elem.et);

        let timeProcess = "<td rowspan='2'" + additionalStyleTag + " class='" + timeProcessStyle + "'>" + currentTimeProcessDivTag + "</td>";
        let ltTdTag = "<td rowspan='2' class='weatherTimeLTCell'" + additionalStyleTag + ">" + spacing(tmpDate.getHours(), " ") + ":" + spacing(tmpDate.getMinutes(), "0") + "</td>";
        let etTdTag = "<td rowspan='2' class='weatherTimeETCell'" + additionalStyleTag + ">" + elem.et.toString().substr(0, 5) + "</td>";
        let NorDTdTag1 = "<td rowspan='1'" + "" + " class='" + (elem.dayornight1 == 0 ? "daycell" : "nightcell") + "'>&nbsp;</td>";
        let NorDTdTag2 = "<td rowspan='1'" + "" + " class='" + (elem.dayornight2 == 0 ? "daycell" : "nightcell") + "'>&nbsp;</td>";
        let weatherTdTag = "<td rowspan='2'" + additionalStyleTag + " class='" + weatherCellClass + "'><div class='cellDiv'>"+  elem.weather + "</div>" + "</td>";

        let trTag1 = "<tr>" + timeProcess + ltTdTag + etTdTag + NorDTdTag1 + weatherTdTag + "</tr>";
        let trTag2 = "<tr>" + NorDTdTag2 + "</tr>";

        //console.log(trTag1 + trTag2);

        // let trTag1 = "<tr></tr>";
        // let trTag2 = "<tr></tr>";


        tmpTableInnerHTMLTag += trTag1;
        tmpTableInnerHTMLTag += trTag2;
    };


    dataTable.innerHTML = "";
    dataTable.append(initTR);
    dataTable.innerHTML += tmpTableInnerHTMLTag;

    updateCurrentProcess(currentDate);

}

function spacing(num, spacer) {
    return num < 10 ? spacer + num : num;
}

/*
function getWeatherIdByName(name) {
    for (let i = 0; i < allWeatherItem.length; i++) {
        if (allWeatherItem[i].name == name) {
            return allWeatherItem[i].id;
        }
    }
    return 9999;
}

function getWeatherDataById(id) {
    for (let i = 0; i < allWeatherItem.length; i++) {
        if (allWeatherItem[i].id == id) {
            return allWeatherItem[i];
        }
    }
    return null;
}
*/

function updateTime() {
    showLocalTime();
    showEtTime();
}

function showLocalTime() {
    let currentTime = new Date();
    localTimeElement.innerHTML = "LT：" + spacing(currentTime.getHours(), "0") + ":" + spacing(currentTime.getMinutes(), "0") + ":" + spacing(currentTime.getSeconds(), "0");
    // eorzeaTimeElement.innerHTML = "ET：" + spacing(currentTime.getHours(),"0") + ":" + spacing(currentTime.getMinutes(),"0") + ":" + spacing(currentTime.getSeconds(),"0");

    const eorzeaTime = new EorzeaTime();
    const eorzeaTimeStr = eorzeaTime.toString().substr(0, 5);

    //console.log("eorzeaTimeStr",eorzeaTimeStr);

    if (eorzeaTimeStr == "00:00"
        || eorzeaTimeStr == "08:00"
        || eorzeaTimeStr == "016:00") {
        //console.log("process() is called.");
        process();
        //setTimeout(process, 0);

    }

}

function showEtTime() {
    var eorzeaTime = new EorzeaTime();
    eorzeaTimeElement.textContent = "ET：" + eorzeaTime.toString().substr(0, 5);

    updateCurrentProcess(new Date())
}

function getET(date) {
    let result = new EorzeaTime(new Date(date));
    // console.log("getET", result);

    return result;
}

function createEtStr(date) {
    let et = getEt(date);
    eorzeaTimeElement.innerHTML = "ET：" + et.substr(0, 5) + "&nbsp;&nbsp;&nbsp;";
}

function updateCurrentProcess(_currentDate) {

    const currentPassedElement = document.getElementById("currentPassed");
    const currentFutureElement = document.getElementById("currentFuture");

    let passedHeight = "100%";
    let futureHeight = "0%";

    // console.log("_currentDate" , _currentDate);

    const currentDateMills = _currentDate.getTime();
    const startDateMills = getWeatherStartTime(new Date(_currentDate));
    const endDateMills = startDateMills + 23 * 60 * 1000 + 20 * 1000;

    // console.log("currentDateMills", new Date(currentDateMills));
    // console.log("startDateMills", new Date(startDateMills));
    // console.log("endDateMills", new Date(endDateMills));

    const passedMills = currentDateMills - startDateMills;
    const futureMills = endDateMills - currentDateMills;
    // console.log("passedMills", (passedMills / 1000));
    // console.log("futureMills", (futureMills / 1000));

    const fullMills = 23 * 60 * 1000 + 20 * 1000;
    const passedPercent = Math.round(100 * passedMills / fullMills) + "%";
    const futurePercent = Math.round(100 * futureMills / fullMills) + "%";

    // console.log("passed %:", passedPercent);
    // console.log("future %:", futurePercent);

    if (currentPassedElement != undefined) {
        currentPassedElement.style.height = passedPercent;
    }
    if (currentFutureElement != undefined) {
        currentFutureElement.style.height = futurePercent;
    }

}

function getStartTime(_date) {
    const ltOneHour = 70 * 60 * 1000;
    // const msec = _date.getTime() - 2 * (70 * 60 * 1000);
    // const startMsec = msec - (_date.getTime() % (2 * 70 * 60 * 1000));
    // const startMsec = msec - (msec % (2 * 70 * 60 * 1000));
    const msec = _date.getTime();
    const startOfTheEorzeaDay = msec - (msec % ltOneHour);
    const startMsec = startOfTheEorzeaDay - 1 * ltOneHour;

    return startMsec;
};

function getWeatherStartTime(_date) {
    const oneHour = 175 * 1000;
    let msec = _date.getTime();

    const bell = (msec / oneHour) % 8;
    const startMsec = msec - Math.round(oneHour * bell);
    return startMsec;
};


// /**
//  * 0:day
//  * 1:nigiht
//  */
function getDayOrNight(et, code) {
    // console.log("et is " + et);
    if (et == "00") {
        return code == 0 ? 1 : 0;
    } else if (et == "08") {
        return 0;
    } else if (et == "16") {
        return code == 0 ? 0 : 1;
    } else {
        console.error("ETが不正です");
    }
    return 9;
}
