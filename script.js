let current = new Date();

const authorMap = {
  "冨永 佑介": "tommy_y",
  "坂上 晴信": "subroh_0508",
  "西平 基志": "nishihira",
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
  "加藤 未央": "oyaoyalog"
};

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
    const day = document.createElement("div");
    day.className = "day";

    const dateStr = `${year}/${String(month + 1).padStart(2,"0")}/${String(d).padStart(2,"0")}`;

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = d;
    day.appendChild(num);

    const events = data.filter(e => e.date === dateStr);

    // 外部仕様
    const filtered = events.filter(e => 
      e.status === "公開" || e.type === "登壇"
    );

    filtered.slice(0,2).forEach(e => {
      const el = document.createElement("div");
      el.className = "event";

      const author = authorMap[e.author] || e.author;

      let html = "";

      if (e.image) {
        html += `<img src="${e.image}">`;
      }

      if (e.status === "公開" && e.url) {
        html += `<div class="event-title"><a href="${e.url}" target="_blank">${e.title}</a></div>`;
      } else {
        html += `<div class="event-title">${e.title}</div>`;
      }

      html += `<div class="event-author">@${author}</div>`;

      el.innerHTML = html;
      day.appendChild(el);
    });

    if (filtered.length > 2) {
      const more = document.createElement("div");
      more.className = "more";
      more.textContent = `+${filtered.length - 2} more`;
      day.appendChild(more);
    }

    calendar.appendChild(day);
  }
}

document.getElementById("prev").onclick = () => {
  current.setMonth(current.getMonth() - 1);
  loadCalendar();
};

document.getElementById("next").onclick = () => {
  current.setMonth(current.getMonth() + 1);
  loadCalendar();
};

loadCalendar();
