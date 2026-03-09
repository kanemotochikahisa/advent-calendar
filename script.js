let current = new Date()

fetch("./data/calendar.json")
.then(res => res.json())
.then(data => {

function normalize(date){
return date.replace(/\//g,"-")
}

data = data.map(d=>{
d.date = normalize(d.date)
return d
})

function render(){

const calendar = document.getElementById("calendar")
calendar.innerHTML=""

const year=current.getFullYear()
const month=current.getMonth()

document.getElementById("monthLabel").textContent =
year+" / "+(month+1)

const firstDay = new Date(year,month,1).getDay()
const lastDate = new Date(year,month+1,0).getDate()

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

const dateStr =
year+"-"+String(month+1).padStart(2,"0")+"-"+String(d).padStart(2,"0")

data
.filter(a=>a.date===dateStr)
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
