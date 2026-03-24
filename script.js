let currentDate = new Date();
let holidays = {};
const MAX_VISIBLE = 2;

// 著者変換
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

// 祝日取得
async function fetchHolidays(year) {
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
    holidays = await res.json();
  } catch {
    holidays = {};
  }
}

// 会社休み
function getCompanyHoliday(dateStr) {
  if (dateStr.includes("/12/29") || dateStr.includes("/12/30") || dateStr.includes("/12/31")) return "年末休み";
  if (dateStr.includes("/01/02") || dateStr.includes("/01/03") || dateStr.includes("/01/04")) return "年始休み";
  return null;
}

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

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "empty";
    calendar.appendChild(empty);
  }

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();

    const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    const dayEl = document.createElement("div");
    dayEl.className = "day";

    if (dayOfWeek === 0) dayEl.classList.add("sun");
    if (dayOfWeek === 6) dayEl.classList.add("sat");

    // 🔥 修正ポイント（祝日）
    const holidayKey = dateStr.replaceAll("/", "-");
    const holidayName = holidays[holidayKey];
    const companyHoliday = getCompanyHoliday(dateStr);

    if (holidayName || companyHoliday) {
      dayEl.classList.add("holiday-day");

      const holidayEl = document.createElement("div");
      holidayEl.className = "holiday";
      holidayEl.textContent = companyHoliday || holidayName;
      dayEl.appendChild(holidayEl);
    }

    const dateEl = document.createElement("div");
    dateEl.className = "date";
    dateEl.textContent = d;
    dayEl.appendChild(dateEl);

    const events = data.filter(e => e.date === dateStr);
    const eventsWrap = document.createElement("div");
    eventsWrap.className = "events";

    events.forEach((e, index) => {
      const el = document.createElement("a");

      const isPublic = e.status === "公開";

      el.className = "event";
      if (!isPublic) el.classList.add("draft");

      if (isPublic && e.url) {
        el.href = e.url;
        el.target = "_blank";
      }

      if (index >= MAX_VISIBLE) {
        el.style.display = "none";
        el.classList.add("hidden-event");
      }

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

      const title = document.createElement("div");
      title.textContent = e.title;
      el.appendChild(title);

      const zennId = convertAuthor(e.author);
      const author = document.createElement("div");
      author.className = "author";
      author.innerHTML = `<a href="https://zenn.dev/${zennId}" target="_blank">@${zennId}</a>`;
      el.appendChild(author);

      eventsWrap.appendChild(el);
    });

    if (events.length > MAX_VISIBLE) {
      const moreBtn = document.createElement("div");
      moreBtn.className = "more";

      let opened = false;
      moreBtn.textContent = `+${events.length - MAX_VISIBLE} more`;

      moreBtn.onclick = () => {
        const hidden = eventsWrap.querySelectorAll(".hidden-event");

        hidden.forEach(el => {
          el.style.display = opened ? "none" : "block";
        });

        opened = !opened;
        moreBtn.textContent = opened ? "閉じる" : `+${events.length - MAX_VISIBLE} more`;
      };

      eventsWrap.appendChild(moreBtn);
    }

    dayEl.appendChild(eventsWrap);
    calendar.appendChild(dayEl);
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();
