const pressure = document.querySelector('.pressure')
const humidity = document.querySelector('.humidity')
const wind = document.querySelector('.wind')
const current = document.querySelector('.current')
let selectedDistrict = 'Maseru'
const district = document.querySelector('#district')
const hourlyContain = document.querySelector('.hourly-wrap')
const APIKEY = 'fe664380fb338697e81739c2c3269360'
district.addEventListener('change',()=> {
    selectedDistrict=district.options[district.selectedIndex].text
    fetchData()
})
fetchData()
function fetchData() {
    current.innerHTML=`
    <div class="curent-weather" style="height:122px;justify-content:center">
     <div class="loada">
<span></span>
<span></span>
<span></span>
</div>
     </div> `
    hourlyContain.innerHTML=`
    <div class="curent-weather" style="height:122px;justify-content:center;width:100vw">
     <div class="loada">
<span></span>
<span></span>
<span></span>
</div>
     </div> `

    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${selectedDistrict},ls&APPID=${APIKEY}`
    fetch(url)
        .then(res=>res.json())
        .then(data=>{
            if (data.cod!=='200') {
                throw Error('Unexpected error has occured')
            }
            displyData(data)
        })
        .catch(err=>{
            hide(document.querySelector('.hourly-container'))
            hide(document.querySelector('.info-container'))
            return current.innerHTML=`
        <div class="curent-weather" style="height:122px;justify-content:center">
         ${err}
         </div> `})

}

function displyData(data) {
    const currentWeather =data.list[0]
    const description =(currentWeather.weather[0].description).slice(0,1).toUpperCase()+(currentWeather.weather[0].description).slice(1)
    const currentHtml = `
    <h3>Current Weather(${selectedDistrict})</h3>
    <div class="curent-weather">
        <h2 class="current-temp">${covertToDegree(currentWeather.main.temp).toFixed(2)} °C</h2>
        <img src="${getIcon(currentWeather["weather"][0].main)}" alt="icon">
        <p>${description}</p> 
    </div> `
    const forecasts = data.list.slice(1,7)
    hourlyContain.innerHTML=itemIterator(forecasts)
    

    current.innerHTML=currentHtml
    pressure.innerHTML=data.list[0].main.pressure+' hPa'
    humidity.innerHTML=data.list[0].main.humidity+'%'
    wind.innerHTML=data.list[0].wind.speed+' m/s'
}
function covertToDegree(temp) {
    const degree = temp -273.15
    return degree
}
function itemIterator(items) {
    let forecastsItems=''
    items.forEach(item=>{
        forecastsItems +=` 
        <div class="curent-weather forecast">
            <h3 >${formatTime(item.dt_txt)}</h3>
            <img src="${getIcon(item.weather[0].main)}" alt="icon">
            <p>${covertToDegree(item.main.temp).toFixed()} °C</p>
        </div>`
    })
    return forecastsItems
}
function getIcon(icon) {
    switch (icon) {
        case 'Sunny':
            return './sun.png'
        case 'Clear':
            return './clear.png'
        case 'Rain':
            return './rain.png'
        default:
            return './clouds.png';
    }
}
function formatTime(date) {
    date = date.slice(date.indexOf(' '),date.lastIndexOf(':')).trim()
    return date
}
function hide(ele) {
    ele.style.display='none'
}
