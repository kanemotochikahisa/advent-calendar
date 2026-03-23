let currentDate = new Date()
let holidays = {}

async function loadHoliday(){
  const res = await fetch("https://holidays-jp.github.io/api/v1/date.json")
  holidays = await res.json()
}

async function loadCalendar(){

  const res = await fetch("data/calendar.json")
  let data = await res.json()

  /* 日付フォーマット統一 */
  data = data.map(d => ({
    ...d,
    date: d.date.replaceAll("/", "-")
  }))

  const year = currentDate.getFullYear()

  /* 年末年始（祝日扱い） */
  const extraHoliday = {
    [`${year}-12-29`]: "年末休暇",
    [`${year}-12-30`]: "年末休暇",
    [`${year}-12-31`]: "年末休暇",
    [`${year}-01-01`]: "元日",
    [`${year}-01-02`]: "年始休暇",
    [`${year}-01-03`]: "年始休暇",
    [`${year}-01-04`]: "年始休暇"
  }

  const mergedHolidays = {
    ...holidays,
    ...extraHoliday
  }

  const calendar = document.getElementById("calendar")
  const monthLabel = document.getElementById("monthLabel")

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ]

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

    const dateObj = new Date(year,month,day)
    const weekDay = dateObj.getDay()

    const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`

    const holidayName = mergedHolidays[dateKey] || ""
    const isHoliday = !!mergedHolidays[dateKey]

    const items = data.filter(d => d.date === dateKey)

    let cards = ""

    const visible = items.slice(0,3)

    visible.forEach(item=>{

      /* 登壇 */
      if(item.type === "登壇"){
        cards += `
        <div class="event talk">
          <div class="talk-label">🎤 登壇</div>
          ${item.title}
          <div class="author">${item.author || ""}</div>
        </div>`
        return
      }

      /* 画像 */
      let img = item.image
        ? `<img src="${item.image}">`
        : `<div class="no-image">No Image</div>`

      /* ★ここ重要（完全統一） */
      if(item.status === "公開" && item.url){
        /* 公開 → リンク */
        cards += `
        <a class="event" href="${item.url}" target="_blank">
          ${img}
          ${item.title}
          <div class="author">${item.author || ""}</div>
        </a>`
      }else{
        /* 未公開 → div（見えるだけ） */
        cards += `
        <div class="event">
          ${img}
          ${item.title}
          <div class="author">${item.author || ""}</div>
        </div>`
      }
    })

    if(items.length > 3){
      const hidden = items.slice(3).map(item=>`
        <div class="event extra hidden">
          ${item.title}
        </div>
      `).join("")

      cards += `
        <div class="more" onclick="toggleMore(this)">
          +${items.length-3} more
        </div>
        ${hidden}
      `
    }

    let className = "day"

    /* 祝日＝日曜 */
    if(weekDay === 0 || isHoliday) className += " sun"
    if(weekDay === 6) className += " sat"

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

/* +more */
function toggleMore(el){

  const parent = el.parentElement
  const hidden = parent.querySelectorAll(".extra")
  const isOpen = el.innerText.includes("閉じる")

  document.querySelectorAll(".extra").forEach(e=>{
    e.classList.add("hidden")
  })

  document.querySelectorAll(".more").forEach(m=>{
    m.innerText = m.innerText.includes("閉じる") ? "more" : m.innerText
  })

  if(!isOpen){
    hidden.forEach(e=>{
      e.classList.remove("hidden")
    })
    el.innerText = "閉じる"
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

async function init(){
  await loadHoliday()
  await loadCalendar()
}

init()
