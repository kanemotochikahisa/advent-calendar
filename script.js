let current = new Date();
let holidays = {};
const zennCache = {};

// ===== 本名 → Zenn ID対応表 =====
const authorMap = {
  "西田 泰明": "ynis_qa",
  "西平 基志": "nishihira",
  "坂上 晴信": "subroh_0508",
  "西川 真澄": "m_nishikawa",
  "東 優太": "muyu",
  "花房 優貴": "fusasnnn",
  "重村 優太": "sigok5904",
  "小口 翔太": "koguchi_s",
  "阿野 庸太郎": "hidetama",
  "芦田 拓人": "takuto1023",
  "木村 陸人": "krkrkrrk",
  "市原 航": "koichihara",
  "橘高 俊": "1knco",
  "賀部 寿音": "jk_koro",
  "石川 裕才": "toshi_3",
  "筒井 智也": "tomoya1",
  "戸松 一貴": "kazt06",
  "對馬 克": "tsushima_m",
  "村上 雅一": "mura_massann",
  "立花 斐斗": "lapi",
  "岡本 匡弘": "o8n",
  "西片 文哉": "fum1ple",
  "井上 智敬": "tomoyukiinoue",
  "池田 新": "arata_maru",
  "加藤 未央": "oyaoyalog",
  "冨永 佑介": "tommy_y"
};

// ===== 祝日 =====
async function loadHolidays() {
  try {
    const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    holidays = await res.json();
  } catch {
    holidays = {};
  }
}

// ===== 年末年始 =====
function isCompanyHoliday(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return (m === 12 && d >= 29) || (m === 1 && d <= 3);
}

// ===== Zenn表示名取得 =====
async function getZennName(username) {
  if (!username) return "Unknown";
  if (zennCache[username]) return zennCache[username];

  try {
    const res = await fetch(`https://zenn.dev/api/users/${username}`);
    const data = await res.json();
    zennCache[username] = data.name;
    return data.name;
  } catch {
    return username;
  }
}

// ===== カレンダー =====
async function loadCalendar() {

  const res = await fetch("data/calendar.json");
  const data = await res.json();

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  document.getElementById("month").textContent =
    `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= lastDate; d++) {

    const dateObj = new Date(year, month, d);

    const holidayKey =
      `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    const dateSlash =
      `${year}/${String(month + 1).padStart(2,"0")}/${String(d).padStart(2,"0")}`;

    const day = document.createElement("div");
    day.className = "day";

    const week = dateObj.getDay();
    if (week === 0) day.classList.add("sun");
    if (week === 6) day.classList.add("sat");

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = d;
    day.appendChild(num);

    // 祝日
    if (holidays[holidayKey]) {
      day.classList.add("holiday");
      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = holidays[holidayKey];
      day.prepend(label);
    }

    // 年末年始
    if (isCompanyHoliday(dateObj)) {
      day.classList.add("holiday");
      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = "年末年始休業";
      day.prepend(label);
    }

    // イベント
    const events = data.filter(e =>
      e.date === holidayKey || e.date === dateSlash
    );

    const filtered = events.filter(e =>
      e.status === "公開" || e.type === "登壇"
    );

    for (const e of filtered.slice(0,2)) {

      const el = document.createElement("div");
      el.className = "event";

      const zennId = authorMap[e.author] || e.author;
      const displayName = await getZennName(zennId);

      let html = "";

      if (e.image) html += `<img src="${e.image}">`;

      if (e.url) {
        html += `<div class="event-title"><a href="${e.url}" target="_blank">${e.title}</a></div>`;
      } else {
        html += `<div class="event-title">${e.title}</div>`;
      }

      html += `
        <div class="event-author">
          <a href="https://zenn.dev/${zennId}" target="_blank">
            ${displayName}
          </a>
        </div>
      `;

      el.innerHTML = html;
      day.appendChild(el);
    }

    calendar.appendChild(day);
  }
}

// ナビ
document.getElementById("prev").onclick = () => {
  current.setMonth(current.getMonth() - 1);
  loadCalendar();
};

document.getElementById("next").onclick = () => {
  current.setMonth(current.getMonth() + 1);
  loadCalendar();
};

async function init() {
  await loadHolidays();
  await loadCalendar();
}

init();
