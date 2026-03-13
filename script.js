let currentDate = new Date()

async function loadCalendar(){

const res = await fetch("data/calendar.json")
let data = await res.json()

/* ===== 重複記事削除 ===== */

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

const dateStr = `${year}/${String(month+1).padStart(2,"0")}/${String(day).padStart(2,"0")}`

const items = data.filter(d=>d.date===dateStr)

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

cards += `
<div class="more" onclick="openModal('${dateStr}')">
+${items.length-3} more
</div>
`

}

html += `
<div class="day">
<div class="date">${day}</div>
<div class="events">
${cards}
</div>
</div>
`

day++

}

calendar.innerHTML = html
window.calendarData = data

}

/* ===== Modal ===== */

function openModal(date){

const items = window.calendarData.filter(d=>d.date===date)

let html = ""

items.forEach(item=>{

if(item.type==="登壇"){

html += `
<div class="modal-item">
🎤 登壇<br>
${item.title}<br>
${item.author}
</div>
`

}else{

html += `
<a class="modal-item" href="${item.url}" target="_blank">
${item.title}<br>
${item.author}
</a>
`

}

})

const modal = document.createElement("div")
modal.className="modal"

modal.innerHTML=`
<div class="modal-content">
<h3>${date}</h3>
${html}
<button onclick="closeModal()">閉じる</button>
</div>
`

document.body.appendChild(modal)

}

function closeModal(){
document.querySelector(".modal").remove()
}

/* ===== Month navigation ===== */

function prevMonth(){
currentDate.setMonth(currentDate.getMonth()-1)
loadCalendar()
}

function nextMonth(){
currentDate.setMonth(currentDate.getMonth()+1)
loadCalendar()
}

/* ===== Timeline ===== */

async function loadTimeline(){

const res = await fetch("data/calendar.json")
const data = await res.json()

const timeline = document.getElementById("timeline")

let counts = {}

data.forEach(item=>{

const month = item.date.slice(0,7)

counts[month] = (counts[month] || 0) + 1

})

let html = ""

Object.keys(counts).sort().forEach(month=>{

html += `
<div class="timeline-month">
<b>${month}</b><br>
${counts[month]} posts
</div>
`

})

timeline.innerHTML = html

}

loadCalendar()
loadTimeline()
