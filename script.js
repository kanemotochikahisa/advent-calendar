let currentDate=new Date()

async function loadCalendar(){

const res=await fetch("data/calendar.json")
const data=await res.json()

const holidays=await fetch(
"https://holidays-jp.github.io/api/v1/date.json"
).then(r=>r.json())

const calendar=document.getElementById("calendar")
const monthLabel=document.getElementById("monthLabel")

const months=[
"January","February","March","April","May","June",
"July","August","September","October","November","December"
]

const year=currentDate.getFullYear()
const month=currentDate.getMonth()

monthLabel.innerText=`${months[month]} ${year}`

const firstDay=new Date(year,month,1)
const lastDay=new Date(year,month+1,0)

const startWeek=firstDay.getDay()

let html=""
let day=1

for(let i=0;i<42;i++){

if(i<startWeek||day>lastDay.getDate()){
html+=`<div class="day empty"></div>`
continue
}

const dateStr=`${year}/${String(month+1).padStart(2,"0")}/${String(day).padStart(2,"0")}`

const items=data.filter(d=>d.date===dateStr)

let cards=""

let visible=items.slice(0,3)

visible.forEach(item=>{

let img=item.image?`<img src="${item.image}">`:""

if(item.type==="登壇"){

cards+=`

<div class="event talk">

<div class="talk-label">🎤 登壇</div>

${item.title}

<div class="author">${item.author}</div>

</div>

`

}else{

if(item.url){

cards+=`

<a class="event article" href="${item.url}" target="_blank">

${img}

${item.title}

<div class="author">${item.author}</div>

</a>

`

}else{

cards+=`

<div class="event article">

${img}

${item.title}

<div class="author">${item.author}</div>

</div>

`

}

}

})

if(items.length>3){

cards+=`
<div class="more">
+${items.length-3} more
</div>
`

}

let holiday=""

if(holidays[dateStr]){
holiday=`<div class="holiday">${holidays[dateStr]}</div>`
}

html+=`

<div class="day">

<div class="date">${day}</div>

${holiday}

<div class="events">

${cards}

</div>

</div>

`

day++

}

calendar.innerHTML=html

}

function prevMonth(){

currentDate.setMonth(currentDate.getMonth()-1)
loadCalendar()

}

function nextMonth(){

currentDate.setMonth(currentDate.getMonth()+1)
loadCalendar()

}

async function loadTimeline(){

const res=await fetch("data/calendar.json")
const data=await res.json()

const timeline=document.getElementById("timeline")

const monthMap={
12:"Dec",
1:"Jan",
2:"Feb",
3:"Mar",
4:"Apr",
5:"May"
}

let counts={
12:0,
1:0,
2:0,
3:0,
4:0,
5:0
}

data.forEach(item=>{

const m=parseInt(item.date.split("/")[1])

if(counts[m]!==undefined){
counts[m]++
}

})

let html=""

Object.keys(monthMap).forEach(m=>{

html+=`
<div class="timeline-month">
<b>${monthMap[m]}</b><br>
${counts[m]} posts
</div>
`

})

timeline.innerHTML=html

}

loadCalendar()
loadTimeline()
