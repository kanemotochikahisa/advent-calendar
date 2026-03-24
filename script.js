let currentDate = new Date()
let holidays = {}

/* ========================
   名前変換
======================== */
const nameMap = {
  "兼本集久": "kanemoto",
  "兼本 集久": "kanemoto",

  "坂上晴信": "subroh_0508",
  "坂上 晴信": "subroh_0508",

  "西平基志": "nishihira",
  "西平 基志": "nishihira",

  "西川真澄": "m_nishikawa",
  "西川 真澄": "m_nishikawa",

  "東優太": "muyu",
  "東 優太": "muyu",

  "花房優貴": "fusasnnn",
  "花房 優貴": "fusasnnn",

  "重村優太": "sigok5904",
  "重村 優太": "sigok5904",

  "小口翔太": "koguchi_s",
  "小口 翔太": "koguchi_s",

  "阿野庸太郎": "hidetama",
  "阿野 庸太郎": "hidetama",

  "芦田拓人": "takuto1023",
  "芦田 拓人": "takuto1023",

  "木村陸人": "krkrkrrk",
  "木村 陸人": "krkrkrrk",

  "市原航": "koichihara",
  "市原 航": "koichihara",

  "橘高俊": "1knco",
  "橘高 俊": "1knco",

  "賀部寿音": "jk_koro",
  "賀部 寿音": "jk_koro",

  "石川裕才": "toshi_3",
  "石川 裕才": "toshi_3",

  "筒井智也": "tomoya1",
  "筒井 智也": "tomoya1",

  "戸松一貴": "kazt06",
  "戸松 一貴": "kazt06",

  "對馬克": "tsushima_m",
  "對馬 克": "tsushima_m",

  "村上雅一": "mura_massann",
  "村上 雅一": "mura_massann",

  "立花斐斗": "lapi",
  "立花 斐斗": "lapi",

  "岡本匡弘": "o8n",
  "岡本 匡弘": "o8n",

  "西片文哉": "fum1ple",
  "西片 文哉": "fum1ple",

  "西田泰明": "ynis_qa",
  "西田 泰明": "ynis_qa",

  "井上智敬": "tomoyukiinoue",
  "井上 智敬": "tomoyukiinoue",

  "池田新": "arata_maru",
  "池田 新": "arata_maru",

  "加藤未央": "oyaoyalog",
  "加藤 未央": "oyaoyalog",

  "冨永佑介": "tommy_y",
  "冨永 佑介": "tommy_y"
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
   メイン
======================== */
async function loadCalendar(){

  const res = await fetch("data/calendar.json")
  let data = await res.json()

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
    const isHoliday = !!holidays[dateKey]

    const items = data.filter(d => d.date === dateKey)

    let cards = ""

    items.slice(0,3).forEach(item=>{

      const author = convertName(item.author || "")

      let img = item.image
        ? `<img src="${item.image}">`
        : `<div class="no-image">No Image</div>`

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
