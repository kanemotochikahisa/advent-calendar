fetch("data/calendar.json")
.then(res=>res.json())
.then(data=>{

const cal=document.getElementById("calendar")

data.forEach(d=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`
<div class="day">Day ${d.day}</div>
<div>${d.title}</div>
<div>${d.author}</div>
<a href="${d.url}" target="_blank">記事</a>
`

cal.appendChild(card)

})

})
