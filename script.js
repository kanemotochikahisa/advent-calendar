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
  try {
    const res = await fetch("data/calendar.json");
    const data = await res.json();

    console.log("全データ:", data);

    // ✅ 公開 or 登壇だけ残す
    const filtered = data.filter(d =>
      (d.status && d.status.includes("公開")) ||
      d.type === "登壇"
    );

    console.log("表示データ:", filtered);

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

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= lastDate; d++) {
    const dayEl = document.createElement("div");

    const dateStr1 = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
    const dateStr2 = `${year}/${month + 1}/${d}`;

    const events = data.filter(e => {
      if (!e.date) return false;
      const normalized = e.date.replace(/-/g, "/");
      return normalized === dateStr1 || normalized === dateStr2;
    });

    const date = document.createElement("div");
    date.textContent = d;
    dayEl.appendChild(date);

    events.forEach(e => {
      const el = document.createElement("div");

      const zennId = AUTHOR_MAP[e.author] || e.author;

      // ✅ 公開記事
      if (e.status && e.status.includes("公開")) {
        el.innerHTML = `
          <a href="${e.url}" target="_blank">
            <div>${e.title}</div>
          </a>
          <div>@${zennId}</div>
        `;
      }
      // ✅ 登壇（リンクなし）
      else if (e.type === "登壇") {
        el.innerHTML = `
          <div style="opacity:0.7;">
            🎤 ${e.title}
          </div>
          <div>@${zennId}</div>
        `;
      }

      dayEl.appendChild(el);
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
