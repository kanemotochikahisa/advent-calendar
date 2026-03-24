let currentDate = new Date()

async function loadCalendar(){

  const res = await fetch("data/calendar.json")
  const data = await res.json()

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

    const items = data.filter(d => d.date === dateStr)

    let cards = ""

    items.forEach(item=>{

      // 公開 → リンク
      if(item.status === "公開"){
        cards += `
        <a class="event" href="${item.url}" target="_blank">
          ${item.title}
          <div class="author">${item.author}</div>
        </a>`
      }else{
        // 未公開 → 表示のみ
        cards += `
        <div class="event draft">
          ${item.title}
          <div class="author">${item.author}</div>
        </div>`
      }

    })

    html += `
    <div class="day">
      <div class="date">${day}</div>
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

loadCalendar()
