// // function sleep(ms){
// //     return new Promise(resolve => setTimeout(resolve, ms));
// // }

let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг','Пятница', 'Суббота'];
let shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

let cityHistories = [];

let keys = ['e33e5abef8684a4690beb4c1d2cfc954', '3ac4fad301094b208ee174e8c75b423b', 'fb96a1d0e1f3413b98f4ce2249ff37d3'];

let popup = document.querySelector('.popup');
let err_popup = document.querySelector('.err-popup');
popup.style.display = 'none';
err_popup.style.display = 'none';

let getIcon = (code) => {
    code = String(code);
    icon = '';
    currentStatus = '';
    if(code == '200' || code == '201' || code == '202' || code == '300' || code == '301' || code == '302' || code == '500' || code == '501' || code == '502' || code == '511' || code == '520' || code == '521' || code == '522' || code == '600' || code == '601' || code == '602' || code == '610' || code == '621' || code == '622' || code == '623' || code == '900'){
        icon = './img/cloud_rain_white.svg';
        currentStatus = 'Дожди';
    }
    else if(code == '230' || code == '231' || code == '232' || code == '233' || code == '611' || code == '612' || code == '700' || code == '711' || code == '721' || code == '731' || code == '741' || code == '751' || code == '804'){
        icon = `./img/cloud_white.svg`;
        currentStatus = 'Облачно';
    }
    else if(code == '800'){
        icon = `./img/sun_white.svg`;
        currentStatus = 'Солнечно';
    }
    else if(code == '801' || code == '802' || code == '803'){
        icon = `./img/cloud_sun_white.svg`;
        currentStatus = 'Небольшая облачность';
    }
    return [icon, currentStatus];
}

const getCoordinates = (city) => {
    fetch(`https://api.weatherbit.io/v2.0/current?lat=35.7796&city=${city}&key=${keys[0]}&include=minutely`)
    .then(response => response.json())
    .then(json => {
        


        console.log(json)
        console.log(json.data[0]);

        let arr = json.data[0];

        let icon = getIcon(arr.weather.code)[0];
        let currentStatus = getIcon(arr.weather.code)[1];
        
        let user_date = arr.ob_time;
        user_date = user_date.split('-');
        let day = new Date(user_date[0], +user_date[1] - 1, user_date[2].substr(0,2)).getDay();
        
        document.querySelector('.day').textContent = `${days[day]}`;
        document.querySelector('.date').textContent = `${user_date[2].substr(0,2)}.${+user_date[1]}.${user_date[0]}`;
        document.querySelector('.position').innerHTML = `<img src="img/Location.svg" class="location-img"> ${arr.city_name}, ${arr.country_code}`;
        document.querySelector('.current-status').textContent = currentStatus;
        document.querySelector('.current-temp').textContent = `${Math.floor(arr.temp)}°C`;

        document.querySelector('.weather-img').src = icon;

        document.querySelector('.current-precipitation').innerHTML = `Осадки: <span style="float:right;">${arr.precip}%</span>`;
        document.querySelector('.current-humidity').innerHTML = `Влажность: <span style="float:right;">${arr.rh}%</span>`;
        document.querySelector('.current-wind').innerHTML = `Ветер: <span style="float:right;">${arr.wind_spd} м/с</span>`;
    })
    .catch(err => {
        err_popup.style.display = 'flex';
    })
    fetch(`https://api.weatherbit.io/v2.0/forecast/hourly?city=${city}&key=${keys[0]}&hours=96`)
    .then(response => response.json())
    .then(json => {
        console.log(json);

        let data = json.data;

        let user_date = data[0].datetime;
        user_date = user_date.split('-');
        let day = new Date(user_date[0], +user_date[1] - 1, user_date[2].substr(0,2)).getDay();

        let futureWeatherImg = document.querySelectorAll('.future-weather-img');
        let futureTemp = document.querySelectorAll('.future-temp');
        let futureDays = document.querySelectorAll('.future-day-name');

        counter = 1;
        for (let i = 0; i < futureDays.length; i++) {
            
            console.log(counter + day);
            if (counter + day == 6) {
                futureDays[i].textContent = shortDays[day + counter];
                counter = -5;
            }
            else if(counter + day < 6){
                futureDays[i].textContent = shortDays[day + counter];
                counter++;
            }
            
        }

        for (let i = 0; i < futureWeatherImg.length; i++) {
            futureWeatherImg[i].src = getIcon(data[i * 24].weather.code)[0];
            futureTemp[i].textContent = `${Math.floor(data[i * 24].temp)} °C`;
        }

    })


}

getCoordinates('London');

function ifHover(e){
    console.log(e);
    let backImg = e.childNodes[1].childNodes[1].getAttribute('src');
    e.childNodes[1].childNodes[1].src = backImg.replace('white', 'black');
}
function ifHoverOut(e){
    let backImg = e.childNodes[1].childNodes[1].getAttribute('src');
    e.childNodes[1].childNodes[1].src = backImg.replace('black', 'white');
}


let closePopup = document.querySelector('.close-popup');
let closeErrPopup = document.querySelector('.close-err-popup');
let findCity = document.querySelector('.find-city');
let newCity = document.querySelector('.city-input');
let changeLocation = document.querySelector('.change-location');

closePopup.addEventListener('click', (e) => {
    popup.style.display = 'none';
});
closeErrPopup.addEventListener('click', (e) => {
    err_popup.style.display = 'none';
});

findCity.addEventListener('click', (e) => {
    if(newCity.value != null || newCity.value != '' || newCity.value != undefined){
        getCoordinates(newCity.value);
        let p = document.createElement('p');
        cityHistories.push(newCity.value);
        p.textContent = newCity.value;
        p.style.marginTop = '10px';
        p.style.color = '#FFF';
        p.style.fontSize = '14px';
        p.style.cursor = 'pointer';
        p.addEventListener('click', (e) => {
            getCoordinates(newCity.value);
            popup.style.display = 'none';
        });
        document.querySelector('.history').appendChild(p);
        popup.style.display = 'none';
        localStorage.setItem('1', JSON.stringify(cityHistories));
    }
    else{
        alert('Введите город');
    }
});

changeLocation.addEventListener('click', (e) => {
    popup.style.display = 'flex';

    document.querySelector('.history').innerHTML = `<h4 class="history-header">История запросов</h4>`;

    let history = JSON.parse(localStorage.getItem('1'));
        for (let i = 0; i < history.length; i++) {
            let p = document.createElement('p');
            p.textContent = history[i];
            p.style.marginTop = '10px';
            p.style.color = '#FFF';
            p.style.fontSize = '14px';
            p.style.cursor = 'pointer';
            p.addEventListener('click', (e) => {
                getCoordinates(history[i]);
                popup.style.display = 'none';
            });
            document.querySelector('.history').appendChild(p);
    }
});

let switcher = document.querySelector('#switch');

switcher.addEventListener('click', (e) => {
    if(switcher.checked){
        console.log('black');
    }
    else{
        console.log('white');
    }
});