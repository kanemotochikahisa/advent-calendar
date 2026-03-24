let currentDate = new Date();

let holidays = {};

// 日本の祝日取得
async function fetchHolidays(year) {
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
    holidays = await res.json();
  } catch {
    holidays = {};
  }
}

// TOKIUM休み（固定）
function getCompanyHoliday(dateStr) {
  if (dateStr.includes("/12/29") || dateStr.includes("/12/30") || dateStr.includes("/12/31")) {
    return "年末休み";
  }
  if (dateStr.includes("/01/02") || dateStr.includes("/01/03") || dateStr.includes("/01/04")) {
    return "年始休み";
  }
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

  // 前の空白
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "empty";
    calendar.appendChild(empty);
  }

  // 日付
  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();

    const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    const dayEl = document.createElement("div");
    dayEl.className = "day";

    // 土日カラー
    if (dayOfWeek === 0) dayEl.classList.add("sun");
    if (dayOfWeek === 6) dayEl.classList.add("sat");

    // 祝日 or 会社休み
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

    // イベント
    const events = data.filter(e => e.date === dateStr);

    const eventsWrap = document.createElement("div");
    eventsWrap.className = "events";

    events.forEach(e => {
      const el = document.createElement("a");

      const isPublic = e.status === "公開";

      el.className = "event";
      if (!isPublic) el.classList.add("draft");

      if (isPublic && e.url) {
        el.href = e.url;
        el.target = "_blank";
      } else {
        el.removeAttribute("href");
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
      const author = document.createElement("div");
      author.className = "author";
      author.textContent = e.author;
      el.appendChild(author);

      eventsWrap.appendChild(el);
    });

    dayEl.appendChild(eventsWrap);
    calendar.appendChild(dayEl);
  }

  // ✅ 最後の余白を削除（ここが重要）
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

// 月移動
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
