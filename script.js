let currentDate = new Date()

let holidays = {}

async function loadHoliday(){

const res = await fetch("https://holidays-jp.github.io/api/v1/date.json")

holidays = await res.json()

}

async function loadCalendar(){

const res = await fetch("data/calendar.json")

let data = await res.json()

/* 重複削除 */

const map = new Map()

data.forEach(item=>{
const key = item.url ? item.url : item.title
if(!map.has(key)){
map.set(key,item)
}
})

data = Array.from(map.values())

const calendar = document.getElementById("calendar")

const monthLabel = document.getElementById("monthLabel")

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
]

const year = currentDate.getFullYear()

const month = currentDate.getMonth()

monthLabel.innerText = `${months[month]} ${year}`

const firstDay = new Date(year,month,1)

const lastDay = new Date(year,month+1,0)

const startWeek = firstDay.getDay()

let html = ""

let day = 1

for(let i=0;i<42;i++){

if(i < startWeek || day > lastDay.getDate()){

html += `<div class="day empty"></div>`

continue

}

const dateObj = new Date(year,month,day)

const weekDay = dateObj.getDay()

const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`

const holidayName = holidays[dateKey] || ""

const items = data.filter(d=>d.date === dateKey.replaceAll("-","/"))

let cards = ""

items.slice(0,3).forEach(item=>{

let img = item.image ? `<img src="${item.image}">` : ""

if(item.type === "登壇"){

cards += `
<div class="event talk">
<div class="talk-label">🎤 登壇</div>
${item.title}
<div class="author">${item.author}</div>
</div>
`

}else{

cards += `
<a class="event" href="${item.url}" target="_blank">
${img}
${item.title}
<div class="author">${item.author}</div>
</a>
`

}

})

if(items.length > 3){

cards += `<div class="more">+${items.length-3} more</div>`

}

let className = "day"

if(weekDay === 0) className += " sun"

if(weekDay === 6) className += " sat"

html += `
<div class="${className}">
<div class="date">${day}</div>
<div class="holiday">${holidayName}</div>
<div class="events">${cards}</div>
</div>
`

day++

}

calendar.innerHTML = html

}

function prevMonth(){
currentDate.setMonth(currentDate.getMonth()-1)
loadCalendar()
}

function nextMonth(){
currentDate.setMonth(currentDate.getMonth()+1)
loadCalendar()
}

async function init(){

await loadHoliday()

await loadCalendar()

}

init()
