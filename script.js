let current = new Date();
let holidays = {};
const zennCache = {};

// ===== 祝日取得 =====
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

// ===== カレンダー描画 =====
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

    // ===== 今日ハイライト =====
    const today = new Date();
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    // ===== 日付 =====
    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = d;
    day.appendChild(num);

    // ===== 祝日 =====
    if (holidays[holidayKey]) {
      day.classList.add("holiday");

      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = holidays[holidayKey];
      day.prepend(label);
    }

    // ===== 年末年始 =====
    if (isCompanyHoliday(dateObj)) {
      day.classList.add("holiday");

      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = "年末年始休業";
      day.prepend(label);
    }

    // ===== イベント =====
    const events = data.filter(e =>
      e.date === holidayKey || e.date === dateSlash
    );

    const filtered = events.filter(e =>
      e.status === "公開" || e.type === "登壇"
    );

    for (const e of filtered.slice(0,2)) {

      const el = document.createElement("div");
      el.className = "event";

      let html = "";

      if (e.image) {
        html += `<img src="${e.image}">`;
      }

      if (e.status === "公開" && e.url) {
        html += `<div class="event-title"><a href="${e.url}" target="_blank">${e.title}</a></div>`;
      } else {
        html += `<div class="event-title">${e.title}</div>`;
      }

      const name = await getZennName(e.author);

      html += `<div class="event-author">${name} (@${e.author})</div>`;

      el.innerHTML = html;
      day.appendChild(el);
    }

    if (filtered.length > 2) {
      const more = document.createElement("div");
      more.className = "more";
      more.textContent = `+${filtered.length - 2} more`;
      day.appendChild(more);
    }

    calendar.appendChild(day);
  }
}

// ===== ナビ =====
document.getElementById("prev").onclick = () => {
  current.setMonth(current.getMonth() - 1);
  loadCalendar();
};

document.getElementById("next").onclick = () => {
  current.setMonth(current.getMonth() + 1);
  loadCalendar();
};

// ===== 初期化 =====
async function init() {
  await loadHolidays();
  await loadCalendar();
}

init();
