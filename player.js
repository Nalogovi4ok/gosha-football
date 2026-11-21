// Страница игрока: player.html?id=messi
// Заполняет шапку, историю, фотогалерею и видео из data.js.

// 1. Находим игрока по адресу страницы
var params = new URLSearchParams(location.search);
var id = params.get("id");

var player = null;
var index = -1;
players.forEach(function (p, i) {
  if (p.id === id) {
    player = p;
    index = i;
  }
});

// Неизвестный адрес — возвращаемся в картотеку
if (!player) {
  location.href = "index.html#catalog";
}

// Игроки по алфавиту — для «предыдущий / следующий»
var sortedIds = players
  .map(function (p) { return p.name; })
  .sort(function (a, b) { return a.localeCompare(b, "ru"); });

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
}

// 2. Шапка страницы
document.title = player.name + " — Футболистые";
document.getElementById("p-avatar").textContent = initials(player.name);
document.getElementById("p-name").textContent = player.name;
document.getElementById("p-sub").textContent =
  player.position + " · " + player.club + " · сборная: " + player.country;

document.getElementById("p-stats").innerHTML = player.stats
  .map(function (s) {
    return "<div><b>" + s[0] + "</b><span>" + s[1] + "</span></div>";
  })
  .join("");

// 3. История
document.getElementById("p-early").textContent = player.earlyYears;
document.getElementById("p-style").textContent = player.styleOfPlay;
document.getElementById("p-career").textContent = player.career;

document.getElementById("p-achievements").innerHTML = player.achievements
  .map(function (item) { return "<li>" + item + "</li>"; })
  .join("");

document.getElementById("p-fact").textContent = player.fact;

// 4. Фотогалерея
var photos = player.photos || PLAYER_PHOTOS[player.id] || [];
document.getElementById("p-gallery").innerHTML = photos.length
  ? photos
      .map(function (ph) {
        return (
          '<figure class="photo">' +
          '<a href="' + ph.file + '" target="_blank" rel="noopener">' +
          '<img src="' + ph.file + '" alt="' + player.name + '" loading="lazy">' +
          '</a>' +
          '<figcaption>' + ph.caption + '</figcaption>' +
          '</figure>'
        );
      })
      .join("")
  : '<p class="empty">Фото скоро появятся.</p>';

// 5. Видео
// Если у игрока заполнено поле videos (ссылки на конкретные ролики) — встраиваем их.
// Иначе показываем карточки-ссылки на поиск в YouTube.
var videosDiv = document.getElementById("p-videos");

if (player.videos && player.videos.length) {
  videosDiv.innerHTML = player.videos
    .map(function (v) {
      return (
        '<div class="video-embed">' +
        '<iframe src="https://www.youtube-nocookie.com/embed/' + v.youtube + '"' +
        ' title="' + v.title + '" frameborder="0" allowfullscreen loading="lazy"></iframe>' +
        '<p>' + v.title + '</p>' +
        '</div>'
      );
    })
    .join("");
} else {
  var queries = [
    [player.name + " best goals and skills", "Лучшие голы и моменты"],
    [player.name + " interview and career review", "Интервью и обзор карьеры"]
  ];
  videosDiv.innerHTML = queries
    .map(function (q) {
      return (
        '<a class="video-card" target="_blank" rel="noopener"' +
        ' href="https://www.youtube.com/results?search_query=' + encodeURIComponent(q[0]) + '">' +
        '<span class="video-play">▶</span>' +
        '<span class="video-title">' + q[1] + '</span>' +
        '<span class="video-note">Смотреть на YouTube</span>' +
        '</a>'
      );
    })
    .join("");
}

// 6. Предыдущий / следующий игрок (по алфавиту)
var pos = sortedIds.indexOf(player.name);
var prevName = sortedIds[(pos - 1 + sortedIds.length) % sortedIds.length];
var nextName = sortedIds[(pos + 1) % sortedIds.length];

function nameToId(name) {
  for (var j = 0; j < players.length; j++) {
    if (players[j].name === name) return players[j].id;
  }
  return "";
}

document.getElementById("p-prev").href = "player.html?id=" + nameToId(prevName);
document.getElementById("p-prev").textContent = "← " + prevName;
document.getElementById("p-next").href = "player.html?id=" + nameToId(nextName);
document.getElementById("p-next").textContent = nextName + " →";
