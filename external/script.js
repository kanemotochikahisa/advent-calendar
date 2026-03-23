let currentDate = new Date()
let holidays = {}

async function loadHoliday(){
  const res = await fetch("https://holidays-jp.github.io/api/v1/date.json")
  holidays = await res.json()
}

async function loadCalendar(){

  const res = await fetch("data/calendar.json")
  let data = await res.json()

  /* 日付統一 */
  data = data.map(d => ({
    ...d,
    date: d.date.replaceAll("/", "-")
  }))

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

    const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`

    const holidayName = holidays[dateKey] || ""

    const items = data.filter(d => d.date === dateKey)

    let cards = ""

    items.slice(0,3).forEach(item=>{

      let img = item.image
        ? `<img src="${item.image}">`
        : `<div class="no-image">No Image</div>`

      /* ★公開前提なので全部リンク */
      cards += `
      <a class="event" href="${item.url}" target="_blank">
        ${img}
        ${item.title}
      </a>`
    })

    let className = "day"
    if(holidayName) className += " sun"

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
