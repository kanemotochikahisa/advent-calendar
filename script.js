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

  // 🔥 ここ修正（超重要）
  const published = data.filter(d =>
    d.status && d.status.trim().includes("公開")
  );

  console.log("データ数:", data.length);
  console.log("公開データ:", published.length);

  render(published);
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
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;

    const dayEl = document.createElement("div");
    dayEl.className = "day";

    const day = new Date(year, month, d).getDay();
    if (day === 0) dayEl.classList.add("sun");
    if (day === 6) dayEl.classList.add("sat");

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = d;

    dayEl.appendChild(date);

    const events = data.filter(e => e.date === dateStr);

    const wrap = document.createElement("div");
    wrap.className = "events";

    const visible = events.slice(0, 2);
    const hidden = events.slice(2);

    visible.forEach(e => {
      wrap.appendChild(createEvent(e));
    });

    if (hidden.length > 0) {
      hidden.forEach(e => {
        const el = createEvent(e);
        el.classList.add("hidden-event");
        el.style.display = "none";
        wrap.appendChild(el);
      });

      const more = document.createElement("div");
      more.className = "more";
      more.textContent = `+${hidden.length} more`;

      more.onclick = () => {
        const isOpen = more.classList.toggle("open");

        wrap.querySelectorAll(".hidden-event").forEach(el => {
          el.style.display = isOpen ? "block" : "none";
        });

        more.textContent = isOpen
          ? "閉じる"
          : `+${hidden.length} more`;
      };

      wrap.appendChild(more);
    }

    dayEl.appendChild(wrap);
    calendar.appendChild(dayEl);
  }
}

function createEvent(e) {
  const el = document.createElement("a");
  el.className = "event";
  el.href = e.url;
  el.target = "_blank";

  if (e.image) {
    const img = document.createElement("img");
    img.src = e.image;
    el.appendChild(img);
  } else {
    const no = document.createElement("div");
    no.className = "no-image";
    no.textContent = "No Image";
    el.appendChild(no);
  }

  const title = document.createElement("div");
  title.textContent = e.title;

  const zennId = AUTHOR_MAP[e.author] || e.author;

  const author = document.createElement("div");
  author.className = "author";
  author.textContent = `@${zennId}`;

  el.appendChild(title);
  el.appendChild(author);

  return el;
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
