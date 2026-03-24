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

async function load() {
  const res = await fetch("data/calendar.json");
  const data = await res.json();

  // 公開 or 登壇のみ
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

    const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    const events = data.filter(e => e.date === dateStr);

    events.forEach(e => {
      const zennId = AUTHOR_MAP[e.author] || e.author;

      const card = document.createElement("div");
      card.className = "event";

      // 画像
      const img = document.createElement("img");
      img.src = e.image || "";
      img.alt = "thumb";
      img.onerror = () => img.style.display = "none";

      // タイトル
      const title = document.createElement("div");
      title.className = "event-title";
      title.textContent = e.title;

      // 著者
      const author = document.createElement("div");
      author.className = "event-author";
      author.textContent = `@${zennId}`;

      // ✅ 公開記事 → リンクあり
      if (e.status && e.status.includes("公開")) {
        const link = document.createElement("a");
        link.href = e.url;
        link.target = "_blank";
        link.appendChild(img);
        link.appendChild(title);
        card.appendChild(link);
      }
      // ✅ 登壇 → リンクなし
      else {
        card.style.opacity = "0.7";
        title.textContent = "🎤 " + e.title;
        card.appendChild(img);
        card.appendChild(title);
      }

      card.appendChild(author);
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
