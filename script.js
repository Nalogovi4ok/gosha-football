// Каталог: вкладки сортировки, поиск, карточки.
// Анкеты игроков лежат в data.js.

var mode = "az";   // az | za | club | position
var query = "";

var cardsDiv = document.getElementById("cards");

// Монограмма: первые буквы имени и фамилии — «Лионель Месси» → «ЛМ»
function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
}

// Карточка — ссылка на отдельную страницу игрока
function cardHTML(i) {
  var p = players[i];
  return (
    '<a class="card" style="--theme: ' + p.theme + '" href="player.html?id=' + p.id + '">' +
    '<div class="card-top">' +
    '<div class="avatar">' + initials(p.name) + '</div>' +
    '<div><h3>' + p.name + '</h3>' +
    '<p class="card-position">' + p.position + '</p></div>' +
    '</div>' +
    '<div class="card-meta">' +
    '<span class="card-club">' + p.club + '</span>' +
    '<span class="card-more">Профиль →</span>' +
    '</div>' +
    '</a>'
  );
}

// Отрисовка карточек с учётом вкладки и поиска
function render() {
  var q = query.trim().toLowerCase();

  // индексы игроков, подходящих под поиск
  var found = [];
  players.forEach(function (p, i) {
    if (!q || p.name.toLowerCase().indexOf(q) !== -1 || p.club.toLowerCase().indexOf(q) !== -1) {
      found.push(i);
    }
  });

  // поиск активен — показываем общий список без групп
  if (q) {
    cardsDiv.innerHTML = found.length
      ? found.map(cardHTML).join("")
      : '<p class="empty">Никого не нашли. Попробуйте другое имя.</p>';
    return;
  }

  if (mode === "az" || mode === "za") {
    var sorted = found.slice().sort(function (a, b) {
      var cmp = players[a].name.localeCompare(players[b].name, "ru");
      return mode === "az" ? cmp : -cmp;
    });
    cardsDiv.innerHTML = sorted.map(cardHTML).join("");
    return;
  }

  // группировка: по клубам или по позициям
  var key = mode === "club" ? "club" : "position";
  var groups = {};
  found.forEach(function (i) {
    var g = players[i][key];
    if (!groups[g]) groups[g] = [];
    groups[g].push(i);
  });

  var html = "";
  Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, "ru"); })
    .forEach(function (g) {
      html += '<h2 class="group-title">' + g + '</h2>';
      html += groups[g].map(cardHTML).join("");
    });
  cardsDiv.innerHTML = html;
}

// Вкладки сортировки
document.querySelectorAll(".tab").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelector(".tab.active").classList.remove("active");
    btn.classList.add("active");
    mode = btn.dataset.mode;
    render();
  });
});

// Поиск
document.getElementById("search").addEventListener("input", function (e) {
  query = e.target.value;
  render();
});

render();

// Счётчик в подвале считает игроков сам
document.getElementById("counter").textContent =
  "Всего игроков в картотеке: " + players.length;

// Цифры на hero-экране: игроки, клубы, сборные
var clubs = {};
var countries = {};
players.forEach(function (p) {
  clubs[p.club] = 1;
  countries[p.country] = 1;
});
document.getElementById("hero-stats").innerHTML =
  "<div><b>" + players.length + "</b><span>игроков</span></div>" +
  "<div><b>" + Object.keys(clubs).length + "</b><span>клубов</span></div>" +
  "<div><b>" + Object.keys(countries).length + "</b><span>сборных</span></div>";
