let currentDate = new Date()
let holidays = {}

const nameMap = {
  "冨永 佑介": "tommy_y",
  "坂上 晴信": "subroh_0508",
  "西平 基志": "nishihira"
  // ← 必要に応じて追加
}

function convertName(name){
  return nameMap[name] || name
}

/* ========================
   祝日
======================== */
async function loadHoliday(){
  const res = await fetch("https://holidays-jp.github.io/api/v1/date.json")
  holidays = await res.json()
}

/* ========================
   カレンダー描画
======================== */
async function loadCalendar(){

  const res = await fetch("data/calendar.json")
  let data = await res.json()

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

    const holidayName = holidays[dateStr.replaceAll("/", "-")] || ""

    const items = data.filter(d => d.date === dateStr)

    let cards = ""

    items.slice(0,3).forEach(item=>{

      const author = convertName(item.author)

      const img = item.image
        ? `<img src="${item.image}">`
        : `<div class="no-image">No Image</div>`

      // 🔥 ここが外部用の本質
      if(item.status === "公開"){

        if(item.url){
          cards += `
          <a class="event" href="${item.url}" target="_blank">
            ${img}
            ${item.title}
            <div class="author">${author}</div>
          </a>`
        }else{
          cards += `
          <div class="event warning">
            ${img}
            ${item.title}
            <div class="author">${author}</div>
            <div class="warn-text">URL未設定</div>
          </div>`
        }

      }else{
        // 未公開 → 表示だけ
        cards += `
        <div class="event draft">
          ${img}
          ${item.title}
          <div class="author">${author}</div>
        </div>`
      }

    })

    if(items.length > 3){
      cards += `<div class="more">+${items.length-3} more</div>`
    }

    let className = "day"

    const weekDay = (i % 7)
    if(weekDay === 0 || holidayName) className += " sun"
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

/* ========================
   ナビ
======================== */
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
