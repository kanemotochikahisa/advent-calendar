let current = new Date();

const AUTHOR_MAP = {
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

// 日本の祝日（最低限＋拡張可能）
const HOLIDAYS = {
  "2026/01/01": "元日",
  "2026/01/12": "成人の日",
  "2026/02/11": "建国記念の日",
  "2026/02/23": "天皇誕生日",
  "2026/03/20": "春分の日",
  "2026/04/29": "昭和の日",
  "2026/05/03": "憲法記念日",
  "2026/05/04": "みどりの日",
  "2026/05/05": "こどもの日"
};

function normalizeDate(str) {
  return str?.replace(/-/g, "/");
}

async function load() {
  const res = await fetch("data/calendar.json");
  const data = await res.json();

  const filtered = data.filter(d =>
    (d.status && d.status.includes("公開")) ||
    d.type === "登壇"
  );

  render(filtered);
}

function render(data) {
  const calendar = document.getElementById("calendar");
  const title = document.getElementById("monthTitle");

  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  title.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 空白
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= lastDate; d++) {
    const dayEl = document.createElement("div");

    const dayOfWeek = new Date(year, month, d).getDay();
    const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    // ✅ クラス復元（超重要）
    if (HOLIDAYS[dateStr] || dayOfWeek === 0) {
      dayEl.className = "day sunday";
    } else if (dayOfWeek === 6) {
      dayEl.className = "day saturday";
    } else {
      dayEl.className = "day";
    }

    // 日付
    const dateEl = document.createElement("div");
    dateEl.className = "date";
    dateEl.textContent = d;

    // 祝日表示
    if (HOLIDAYS[dateStr]) {
      const holidayEl = document.createElement("div");
      holidayEl.className = "holiday";
      holidayEl.textContent = HOLIDAYS[dateStr];
      dayEl.appendChild(holidayEl);
    }

    dayEl.appendChild(dateEl);

    const events = data.filter(e => {
      const nd = normalizeDate(e.date);
      return nd === dateStr || nd === `${year}/${month + 1}/${d}`;
    });

    events.forEach(e => {
      const zennId = AUTHOR_MAP[e.author] || e.author;

      const card = document.createElement("div");
      card.className = "event";

      // 画像
      if (e.image) {
        const img = document.createElement("img");
        img.src = e.image;
        img.onerror = () => img.style.display = "none";
        card.appendChild(img);
      }

      const titleEl = document.createElement("div");
      titleEl.className = "event-title";

      const authorEl = document.createElement("div");
      authorEl.className = "event-author";
      authorEl.textContent = `@${zennId}`;

      // 公開記事
      if (e.status && e.status.includes("公開") && e.url) {
        const link = document.createElement("a");
        link.href = e.url;
        link.target = "_blank";
        titleEl.textContent = e.title;
        link.appendChild(titleEl);
        card.appendChild(link);
      }
      // 登壇
      else if (e.type === "登壇") {
        titleEl.textContent = "🎤 " + e.title;
        card.style.opacity = "0.7";
        card.appendChild(titleEl);
      }

      card.appendChild(authorEl);
      dayEl.appendChild(card);
    });

    calendar.appendChild(dayEl);
  }
}

function prevMonth() {
  current.setMonth(current.getMonth() - 1);
  load();
}

function nextMonth() {
  current.setMonth(current.getMonth() + 1);
  load();
}

load();
