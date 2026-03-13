let currentDate = new Date()

async function loadCalendar(){

const res = await fetch("data/calendar.json")

const data = await res.json()

const calendar = document.getElementById("calendar")

const monthLabel = document.getElementById("monthLabel")

calendar.innerHTML=""

const year = currentDate.getFullYear()

const month = currentDate.getMonth()

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
]

monthLabel.innerText = months[month] + " " + year

const firstDay = new Date(year,month,1)

const lastDay = new Date(year,month+1,0)

const startWeek = firstDay.getDay()

let day = 1

for(let i=0;i<42;i++){

if(i < startWeek || day > lastDay.getDate()){

calendar.innerHTML += `<div class="day"></div>`

continue

}

const dateStr = `${year}/${String(month+1).padStart(2,"0")}/${String(day).padStart(2,"0")}`

const items = data.filter(d=>d.date===dateStr)

const week = new Date(year,month,day).getDay()

let dayClass="day"

if(week===0) dayClass+=" sun"

if(week===6) dayClass+=" sat"

let content = `<div>${day}</div>`

/* UIパターン */

const pattern = month % 3

/* Pattern A */

if(pattern===0){

items.slice(0,3).forEach(item=>{

content += `

<div class="card">

<img src="${item.image || ''}">

${item.title}

</div>

`

})

}

/* Pattern B */

if(pattern===1){

content += `<div class="tile-grid">`

items.slice(0,4).forEach(item=>{

content += `

<div class="tile">

<img src="${item.image || ''}">

<span>${item.author}</span>

</div>

`

})

content += `</div>`

}

/* Pattern C */

if(pattern===2){

items.slice(0,3).forEach(item=>{

content += `

<div class="timeline-item">

<img src="${item.image || ''}">

<div>${item.title}</div>

</div>

`

})

}

calendar.innerHTML += `<div class="${dayClass}">${content}</div>`

day++

}

}

function prevMonth(){

currentDate.setMonth(currentDate.getMonth()-1)

loadCalendar()

}

function nextMonth(){

currentDate.setMonth(currentDate.getMonth()+1)

loadCalendar()

}

loadCalendar()
