let current = new Date()

fetch("./data/calendar.json")
.then(res => res.json())
.then(data => {

data = data.map(d=>{
const date = new Date(d.date.replace(/\//g,"-"))
d.year = date.getFullYear()
d.month = date.getMonth()+1
d.day = date.getDate()
return d
})

function render(){

const calendar = document.getElementById("calendar")
calendar.innerHTML=""

const year=current.getFullYear()
const month=current.getMonth()+1

document.getElementById("monthLabel").textContent =
year+" / "+month

const firstDay = new Date(year,month-1,1).getDay()
const lastDate = new Date(year,month,0).getDate()

for(let i=0;i<firstDay;i++){
calendar.appendChild(document.createElement("div"))
}

for(let d=1; d<=lastDate; d++){

const cell=document.createElement("div")
cell.className="day"

const date=document.createElement("div")
date.className="date"
date.textContent=d

cell.appendChild(date)

data
.filter(a=>a.year===year && a.month===month && a.day===d)
.forEach(a=>{

const art=document.createElement("div")
art.className="article"

art.innerHTML=`
<a href="${a.url}" target="_blank">
${a.title}
</a>
<div>${a.author} <span class="type">${a.type}</span></div>
`

cell.appendChild(art)

})

calendar.appendChild(cell)

}

}

render()

document.getElementById("prev").onclick=()=>{
current.setMonth(current.getMonth()-1)
render()
}

document.getElementById("next").onclick=()=>{
current.setMonth(current.getMonth()+1)
render()
}

})
