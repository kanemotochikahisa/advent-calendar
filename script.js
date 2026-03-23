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

  /* 年末年始（12/29〜1/4） */
  const extra = [
    { date: "2026-12-29", title: "年末休暇", type:"holiday" },
    { date: "2026-12-30", title: "年末休暇", type:"holiday" },
    { date: "2026-12-31", title: "年末休暇", type:"holiday" },
    { date: "2027-01-01", title: "元日", type:"holiday" },
    { date: "2027-01-02", title: "年始休暇", type:"holiday" },
    { date: "2027-01-03", title: "年始休暇", type:"holiday" },
    { date: "2027-01-04", title: "年始休暇", type:"holiday" },
  ]

  data = [...data, ...extra]

  /* 重複削除 */
  const map = new Map()
  data.forEach(item=>{
    const key = item.url ? item.url : item.title + item.date
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

    const dateObj = new Date(year,month,day)
    const weekDay = dateObj.getDay()

    const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`

    /* 年末年始含めた祝日判定 */
    const extraHoliday = data.find(d => d.date === dateKey && d.type === "holiday")
    const holidayName = holidays[dateKey] || (extraHoliday ? extraHoliday.title : "")

    const isHoliday = holidays[dateKey] || extraHoliday

    const items = data.filter(d => d.date === dateKey)

    let cards = ""

    const visible = items.slice(0,3)

    visible.forEach(item=>{

      if(item.type === "holiday") return

      if(item.type === "登壇"){
        cards += `
        <div class="event talk">
          <div class="talk-label">🎤 登壇</div>
          ${item.title}
          <div class="author">${item.author || ""}</div>
        </div>`
        return
      }

      if(!item.url){
        cards += `
        <div class="event">
          ${item.title}
          <div class="author">${item.author || ""}</div>
        </div>`
        return
      }

      let img = item.image ? `<img src="${item.image}">` : ""

      cards += `
      <a class="event" href="${item.url}" target="_blank">
        ${img}
        ${item.title}
        <div class="author">${item.author || ""}</div>
      </a>`
    })

    const moreItems = items.filter(i => i.type !== "holiday")

    if(moreItems.length > 3){
      const hidden = moreItems.slice(3).map(item=>`
        <div class="event extra hidden">
          ${item.title}
        </div>
      `).join("")

      cards += `
        <div class="more" onclick="toggleMore(this)">
          +${moreItems.length-3} more
        </div>
        ${hidden}
      `
    }

    /* ★ここが今回の核心 */
    let className = "day"

    if(weekDay === 0) className += " sun"
    if(weekDay === 6) className += " sat"

    if(isHoliday){
      className += " sun"  // ← 祝日も日曜扱いにする
    }

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

/* +more制御 */
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
