let currentDate = new Date();

let holidays = {};

// ===============================
// 著者対応表（本名 → Zenn ID）
// ===============================
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
  "冨永 佑介": "tommy_y"
};

function convertAuthor(name) {
  return authorMap[name] || name;
}

// ===============================
// 日本の祝日
// ===============================
async function fetchHolidays(year) {
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
    holidays = await res.json();
  } catch {
    holidays = {};
  }
}

// ===============================
// TOKIUM休み
// ===============================
function getCompanyHoliday(dateStr) {
  if (dateStr.includes("/12/29") || dateStr.includes("/12/30") || dateStr.includes("/12/31")) {
    return "年末休み";
  }
  if (dateStr.includes("/01/02") || dateStr.includes("/01/03") || dateStr.includes("/01/04")) {
    return "年始休み";
  }
  return null;
}

// ===============================
// カレンダー描画
// ===============================
async function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  await fetchHolidays(year);

  const res = await fetch("data/calendar.json");
  const data = await res.json();

  const calendar = document.getElementById("calendar");
  const label = document.getElementById("monthLabel");

  calendar.innerHTML = "";
  label.textContent = `${currentDate.toLocaleString("en-US", { month: "long" })} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  // 前の空白
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "empty";
    calendar.appendChild(empty);
  }

  // 日付ループ
  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();

    const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    const dayEl = document.createElement("div");
    dayEl.className = "day";

    // 土日
    if (dayOfWeek === 0) dayEl.classList.add("sun");
    if (dayOfWeek === 6) dayEl.classList.add("sat");

    // 祝日・会社休み
    const holidayName = holidays[dateStr];
    const companyHoliday = getCompanyHoliday(dateStr);

    if (holidayName || companyHoliday) {
      dayEl.classList.add("holiday-day");

      const holidayEl = document.createElement("div");
      holidayEl.className = "holiday";
      holidayEl.textContent = companyHoliday || holidayName;
      dayEl.appendChild(holidayEl);
    }

    // 日付
    const dateEl = document.createElement("div");
    dateEl.className = "date";
    dateEl.textContent = d;
    dayEl.appendChild(dateEl);

    // ===============================
    // イベント（完全安定版）
    // ===============================
    const events = data.filter(e => e.date === dateStr);

    const eventsWrap = document.createElement("div");
    eventsWrap.className = "events";

    let expanded = false;

    function renderEvents() {
      eventsWrap.innerHTML = "";

      const displayEvents = expanded ? events : events.slice(0, 3);

      displayEvents.forEach(e => {
        const el = document.createElement("a");

        const isPublic = e.status === "公開";

        el.className = "event";
        if (!isPublic) el.classList.add("draft");

        if (isPublic && e.url) {
          el.href = e.url;
          el.target = "_blank";
        }

        // 画像
        if (e.image) {
          const img = document.createElement("img");
          img.src = e.image;
          el.appendChild(img);
        } else {
          const noImg = document.createElement("div");
          noImg.className = "no-image";
          noImg.textContent = "No Image";
          el.appendChild(noImg);
        }

        // タイトル
        const title = document.createElement("div");
        title.textContent = e.title;
        el.appendChild(title);

        // 著者
        const zennId = convertAuthor(e.author);
        const author = document.createElement("div");
        author.className = "author";
        author.innerHTML = `<a href="https://zenn.dev/${zennId}" target="_blank">@${zennId}</a>`;
        el.appendChild(author);

        eventsWrap.appendChild(el);
      });

      // +more
      if (events.length > 3) {
        const moreBtn = document.createElement("div");
        moreBtn.className = "more";
        moreBtn.textContent = expanded ? "閉じる" : `+${events.length - 3} more`;

        moreBtn.onclick = () => {
          expanded = !expanded;
          renderEvents();
        };

        eventsWrap.appendChild(moreBtn);
      }
    }

    renderEvents();

    dayEl.appendChild(eventsWrap);
    calendar.appendChild(dayEl);
  }

  // 余白調整
  const cells = calendar.children.length;
  const remainder = cells % 7;

  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      const empty = document.createElement("div");
      empty.className = "empty";
      calendar.appendChild(empty);
    }
  }
}

// ===============================
// 月移動
// ===============================
function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

// 初期化
renderCalendar();
