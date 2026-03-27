let current = new Date();
let holidays = {};

// ===== 本名 → Zenn ID =====
const authorMap = {
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
  "西田 泰明": "ynis_qa",
  "井上 智敬": "tomoyukiinoue",
  "池田 新": "arata_maru",
  "加藤 未央": "oyaoyalog",
  "冨永 佑介": "tommy_y",
  "株式会社TOKIUM プロダクト本部": "tokium"
};

// ===== 表示名 =====
const authorDisplayMap = {
  "tommy_y": "とみー",
  "oyaoyalog": "ja_tang",
  "tokium": "株式会社TOKIUM プロダクト本部",
  "nishihira": "西平基志 | TOKIUM",
  "subroh_0508": "にしこりさぶろ〜 | TOKIUM",
  "m_nishikawa": "m-nishikawa",
  "muyu": "yuta higashi",
  "fusasnnn": "hanafusay",
  "sigok5904": "しががガガガ",
  "koguchi_s": "sk",
  "hidetama": "あのたろう",
  "takuto1023": "Takuto1023",
  "krkrkrrk": "kr",
  "koichihara": "Kokoichi",
  "1knco": "いかねこ",
  "jk_koro": "jk",
  "toshi_3": "＿10.4",
  "tomoya1": "tsutsui",
  "kazt06": "kztm",
  "tsushima_m": "tsushima_m",
  "mura_massann": "まっさん | TOKIUM",
  "lapi": "Lapi",
  "o8n": "o8n",
  "fum1ple": "fum1ple",
  "ynis_qa": "ynis_qa",
  "tomoyukiinoue": "tomoyukiinoue",
  "arata_maru": "あらた"
};

// ===== 日付正規化 =====
function normalizeDate(str) {
  const d = new Date(str);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ===== 祝日 =====
async function loadHolidays() {
  const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
  holidays = await res.json();
}

// ===== 年末年始 =====
function isCompanyHoliday(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return (m === 12 && d >= 29) || (m === 1 && d <= 3);
}

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
    const todayKey = normalizeDate(dateObj);

    const day = document.createElement("div");
    day.className = "day";

    const week = dateObj.getDay();
    if (week === 0) day.classList.add("sun");
    if (week === 6) day.classList.add("sat");

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = d;
    day.appendChild(num);

    if (holidays[todayKey]) {
      day.classList.add("holiday");
      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = holidays[todayKey];
      day.prepend(label);
    }

    if (isCompanyHoliday(dateObj)) {
      day.classList.add("holiday");
      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = "年末年始休業";
      day.prepend(label);
    }

    // ===== イベント取得 =====
    const events = data.filter(e =>
      normalizeDate(e.date) === todayKey
    );

    // ★ここ重要：最大2件表示
    events.slice(0, 2).forEach(e => {

      const el = document.createElement("div");
      el.className = "event";

      const zennId = authorMap[e.author] || e.author;
      const displayName =
        authorDisplayMap[zennId] || `@${zennId}`;

      el.innerHTML = `
        ${e.image ? `<img src="${e.image}">` : ""}
        <div class="event-title">
          <a href="${e.url}" target="_blank">${e.title}</a>
        </div>
        <div class="event-author">
          <a href="https://zenn.dev/${zennId}" target="_blank">
            ${displayName}
          </a>
        </div>
      `;

      day.appendChild(el);
    });

    // ★ more表示復活
    if (events.length > 2) {
      const more = document.createElement("div");
      more.className = "more";
      more.textContent = `+${events.length - 2} more`;
      day.appendChild(more);
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

// 初期化
async function init() {
  await loadHolidays();
  loadCalendar();
}

init();
