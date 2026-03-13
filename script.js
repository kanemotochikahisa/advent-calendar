let current = new Date()

fetch("./data/calendar.json")
.then(res => res.json())
.then(data => {

function render(){

const calendar=document.getElementById("calendar")
calendar.innerHTML=""

const year=current.getFullYear()
const month=current.getMonth()+1

document.getElementById("monthLabel").textContent =
year+" / "+month

const firstDay=new Date(year,month-1,1).getDay()
const lastDate=new Date(year,month,0).getDate()

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

const articles=data.filter(a=>{

const parts=a.date.split("/")

return Number(parts[0])===year &&
Number(parts[1])===month &&
Number(parts[2])===d

})

if(articles.length>0){

cell.classList.add("has-article")

articles.slice(0,2).forEach(a=>{

const art=document.createElement("div")
art.className="article"

if(a.type==="TALK"){

art.innerHTML=`
<span>${a.title}</span>
<div class="meta">${a.author}
<span class="badge TALK">TALK</span>
</div>
`

}else{

art.innerHTML=`
<a href="${a.url}" target="_blank">${a.title}</a>
<div class="meta">${a.author}
<span class="badge ${a.type}">${a.type}</span>
</div>
`

}

cell.appendChild(art)

})

}

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
