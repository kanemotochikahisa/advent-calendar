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

function normalizeDate(str) {
  if (!str) return "";
  return str.replace(/-/g, "/");
}

async function load() {
  try {
    const res = await fetch("data/calendar.json");
    const data = await res.json();

    console.log("取得:", data);

    // ✅ 公開 or 登壇のみ
    const filtered = data.filter(d =>
      (d.status && d.status.includes("公開")) ||
      d.type === "登壇"
    );

    render(filtered);

  } catch (e) {
    console.error(e);
  }
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
    dayEl.className = "day";

    const dateEl = document.createElement("div");
    dateEl.className = "date";
    dateEl.textContent = d;
    dayEl.appendChild(dateEl);

    const target = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    const events = data.filter(e => {
      const nd = normalizeDate(e.date);
      return nd === target || nd === `${year}/${month + 1}/${d}`;
    });

    events.forEach(e => {
      const zennId = AUTHOR_MAP[e.author] || e.author;

      const card = document.createElement("div");
      card.className = "event";

      // 画像
      if (e.image) {
        const img = document.createElement("img");
        img.src = e.image;
        img.alt = "thumb";
        img.onerror = () => img.style.display = "none";
        card.appendChild(img);
      }

      const titleEl = document.createElement("div");
      titleEl.className = "event-title";
      titleEl.textContent = e.title;

      const authorEl = document.createElement("div");
      authorEl.className = "event-author";
      authorEl.textContent = `@${zennId}`;

      // ✅ 公開記事
      if (e.status && e.status.includes("公開") && e.url) {
        const link = document.createElement("a");
        link.href = e.url;
        link.target = "_blank";

        link.appendChild(titleEl);
        card.appendChild(link);
      } 
      // ✅ 登壇
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
