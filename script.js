fetch("data/calendar.json")
.then(res=>res.json())
.then(data=>{

const calendar=document.getElementById("calendar")

data.forEach(item=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`
<div class="day">Day ${item.day}</div>
<div class="title">${item.title}</div>
<div class="author">${item.author}</div>
<a href="${item.url}" target="_blank">記事を見る</a>
`

calendar.appendChild(card)

})

})
