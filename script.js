fetch("data.json")
  .then(res => res.json())
  .then(items => {
    items.forEach(item => {
      const cell = document.querySelector(`[data-date="${item.date}"]`);
      if (!cell) return;

      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = item.title;

      const author = document.createElement("div");
      author.className = "author";
      author.textContent = item.author;

      cell.appendChild(a);
      cell.appendChild(author);
    });
  });
