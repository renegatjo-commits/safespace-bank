// Safe Space / Gringotts — внешний файл для HTML-низа
// Встроенный интерфейс доступен только администратору в теме /viewtopic.php?id=1364.

/* Safe Space / Gringotts: закрытый сборщик заявок v2.13 (предыдущие заявки и новые посты только выбранного профиля).
 * Показывается только на safespace.rusff.me/viewtopic.php?id=1364,
 * только авторизованным администраторам форума (GroupID===1).
 * Использует тарифы по действующим правилам банка, а историю заявок
 * читает старые заявки ТОЛЬКО из действующей банковской темы №20.
 * Старые заявки: URL id=ТЕМА#pПОСТ, pid=ПОСТ#pПОСТ и BBCode нормализуются по ID.
 * Сопоставляем API + HTML + ИСХОДНЫЙ BBCODE через GET edit.php?id=ID для ВСЕХ ответов банка №20.
 * Если исходник хотя бы одной заявки прочитать нельзя, НЕ выдаём неполный расчёт.
 * Не удаляем [code]/спойлеры/цитаты при чтении старых заявок.
 * Исключение суточного бонуса +10: темы №687 и №418 (основная оплата сохраняется).
 * НИЧЕГО не начисляет/не списывает/не публикует автоматически.
 * ВАЖНО: реальную приватность темы задают ПРАВА ДОСТУПА Rusff,
 * не эта проверка в JS. Публичный HTML-низ доступен для просмотра кода.
 */
(function () {
  'use strict';
  function mountBank() {
  // На Rusff [html] в сообщениях находится в iframe; основной сборщик — в HTML-низе.
  // Проверяем адрес и права АМС ПОСЛЕ формирования DOM.
  if (location.hostname.replace(/^www\./, '') !== 'safespace.rusff.me') return;
  if (!/\/viewtopic\.php$/i.test(location.pathname) ||
      Number(new URLSearchParams(location.search).get('id')) !== 1364) return;
  var forumRoot = document.getElementById('pun');
  var admin = Number(window.GroupID) === 1 ||
              (forumRoot && forumRoot.classList.contains('isadmin'));
  if (!admin) return; // только администрация; тему дополнительно закрыть правами форума
  if (document.getElementById('ssbc')) return;
  // Стили хранятся вместе со скриптом, отдельный CSS-файл не нужен.
  if (!document.getElementById('ssbc-external-styles')) {
    var bankStyle = document.createElement('style');
    bankStyle.id = 'ssbc-external-styles';
    bankStyle.textContent = "/* Дизайн согласован с темой банка Гринготтс */\n\n.ssbc-wrap { box-sizing: border-box; width: 94%; max-width: 900px; margin: 24px auto;\n  background: #f4f0e8; border: 1px solid #d8d0c5; border-radius: 12px;\n  padding: 19px; font-family: Arial, sans-serif; color: #403a43; }\n.ssbc-wrap .ssbc-headline { font-family: Georgia, serif; font-weight: normal; text-align:center; font-size: 19px; color: #4b3b59; margin: 0 0 6px; }\n.ssbc-wrap .ssbc-intro { color: #766f77; font-size: 12px; line-height: 1.65; text-align: center; margin: 0 0 17px; }\n.ssbc-wrap .ssbc-fields { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; margin-bottom: 14px; }\n.ssbc-wrap .ssbc-fields label { flex: 1 1 175px; display:flex; flex-direction:column; gap:6px; font-size:12px; color:#51415e; }\n.ssbc-wrap .ssbc-fields select, .ssbc-wrap .ssbc-fields input { font: 13px Arial, sans-serif; color:#403a43; border-radius:8px; border:1px solid #cbc0d1; box-sizing:border-box; padding:9px; width:100%; background:#fff; }\n.ssbc-wrap .ssbc-check { display:block; font-size:12px; color:#625a66; line-height:1.5; margin:10px 0 15px; }\n.ssbc-wrap .ssbc-check input, .ssbc-wrap .ssbc-confirm input, .ssbc-wrap .ssbc-row input { vertical-align:middle; accent-color:#695485; }\n.ssbc-wrap .ssbc-button { display:inline-block; border:0; border-radius:8px; padding:11px 17px; font: 12px Arial, sans-serif; cursor:pointer; background:#5f4c75; color:#fff; transition: .2s; }\n.ssbc-wrap .ssbc-button:hover { background: #48345e; }\n.ssbc-wrap .ssbc-button:disabled { opacity:.48; cursor:default; }\n.ssbc-wrap .ssbc-button-light { background:#e4dce9; color:#45394f; }\n.ssbc-wrap .ssbc-button-light:hover { background:#d4c5dd; }\n.ssbc-wrap .ssbc-status { margin:14px 0; border-left:3px solid #a98e61; padding:10px 12px; background:#ece8e2; font-size:12px; line-height:1.5; }\n.ssbc-wrap .ssbc-status.ok { border-color:#678269; background:#e3e9e1; }\n.ssbc-wrap .ssbc-status.error, .ssbc-wrap .ssbc-alert { border-color:#ad665f; background:#f3e4e0; }\n.ssbc-wrap .ssbc-summary { background:#e6ddeb; border-radius:9px; padding:14px; line-height:1.75; text-align:center; margin-top:16px; font-size:13px; color:#453354; }\n.ssbc-wrap .ssbc-small { font-size:11px; line-height:1.5; color:#756e79; }\n.ssbc-wrap .ssbc-alert { border-left:3px solid #ad665f; padding:12px; margin:12px 0; font-size:11px; line-height:1.7; border-radius:4px; }\n.ssbc-wrap .ssbc-alert details { margin-top:6px; max-height:180px; overflow:auto; }\n.ssbc-wrap .ssbc-alert summary { cursor:pointer; }\n.ssbc-wrap .ssbc-rows { max-height:360px; overflow:auto; margin:10px 0 15px; }\n.ssbc-wrap .ssbc-row { display:flex; align-items:center; justify-content:space-between; gap:10px; border-bottom:1px solid #ded6ce; padding:9px 4px; font-size:12px; }\n.ssbc-wrap .ssbc-row label { min-width:0; line-height:1.5; }\n.ssbc-wrap .ssbc-row small { color:#817886; font-size:10px; }\n.ssbc-wrap .ssbc-row b { white-space:nowrap; color:#5a466b; }\n.ssbc-wrap .ssbc-confirm { display:block; padding:12px; font-size:12px; line-height:1.5; background:#f3e4e0; border-radius:8px; margin:8px 0 15px; }\n.ssbc-wrap .ssbc-actions { display:flex; gap:9px; align-items:center; flex-wrap:wrap; margin:12px 0; }\n.ssbc-wrap .ssbc-actions[hidden], .ssbc-wrap #ssbc-custom[hidden] { display:none!important; }\n.ssbc-wrap #ssbc-text { width:100%; min-height:175px; resize:vertical; box-sizing:border-box; border:1px solid #cbc0d1; padding:12px; border-radius:8px; font:12px/1.5 Consolas,monospace; color:#3b3440; background:white; }\n.ssbc-wrap .ssbc-oldclaims { margin: 14px 0; padding: 13px; background: #faf8f4; border: 1px solid #d8d0c5; border-radius: 9px; }\n.ssbc-wrap .ssbc-oldclaims h4 { margin: 0 0 10px; font: normal 15px Georgia,serif; color:#4b3b59; }\n.ssbc-wrap .ssbc-oldclaims-list { max-height:300px; overflow-y:auto; overflow-wrap:anywhere; }\n.ssbc-wrap .ssbc-oldclaims-list .ssbc-claim-entry { padding:5px 3px; border-bottom:1px solid #e9e1d7; font-size:12px; line-height:1.5; }\n.ssbc-wrap .ssbc-oldclaims-list .ssbc-claim-entry:last-child { border-bottom:0; }\n.ssbc-wrap .ssbc-oldclaims-list a { color:#5f4c75; text-decoration: underline; }\n.ssbc-wrap #ssbc-progress[hidden] {display:none!important;}\n.ssbc-wrap #ssbc-progress {padding:12px 14px; margin:12px 0 15px; border:1px solid #d8d0c5; background:#faf8f4; border-radius:9px;}\n.ssbc-wrap .ssbc-progress-top {display:flex; justify-content:space-between; align-items:center; gap:14px; color:#51415e; font:12px/1.4 Arial,sans-serif; margin-bottom:8px;}\n.ssbc-wrap #ssbc-progress-pct {font-weight:700; color:#4b3b59; white-space:nowrap; font-variant-numeric:tabular-nums;}\n.ssbc-wrap #ssbc-progress-bar {display:block; width:100%;height:12px;border:0;border-radius:20px;overflow:hidden;background:#e4dce9;accent-color:#806a99;}\n.ssbc-wrap #ssbc-progress-bar::-webkit-progress-bar {background:#e4dce9;border-radius:20px;}\n.ssbc-wrap #ssbc-progress-bar::-webkit-progress-value {background:linear-gradient(90deg,#806a99,#5f4c75);border-radius:20px;transition:width .22s ease;}\n.ssbc-wrap #ssbc-progress-bar::-moz-progress-bar {background:#806a99;border-radius:20px;}\n.ssbc-wrap #ssbc-progress[data-state='error'] {border-color:#ad665f;}\n.ssbc-wrap #ssbc-progress[data-state='done'] {border-color:#678269;}\n.ssbc-wrap .ssbc-type-row {display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin:8px 0;}\n.ssbc-wrap .ssbc-type-row select {font:12px Arial,sans-serif; padding:7px; border:1px solid #cbc0d1; background:#fff; border-radius:7px; max-width:270px;}\n.ssbc-wrap .ssbc-type-row a {color:#5f4c75; text-decoration:underline;}\n\n@media(max-width:650px){.ssbc-wrap {width:100%;padding:12px;} .ssbc-wrap .ssbc-headline{font-size:16px;} .ssbc-wrap .ssbc-row{flex-wrap:wrap;} .ssbc-wrap .ssbc-fields{gap:9px;} .ssbc-wrap .ssbc-button{padding:10px 11px;} }";
    document.head.appendChild(bankStyle);
  }
  // У Rusff оформление темы может менять вложенность .post и .topicpost.
  var firstPost = document.querySelector('#pun-viewtopic .post.topicpost') ||
                  document.querySelector('#pun-viewtopic .post') ||
                  document.querySelector('#pun-main .post') ||
                  document.querySelector('#pun-viewtopic .topic');
  var mountPoint = firstPost || document.querySelector('#pun-main');
  if (!mountPoint) {
    console.warn('[Gringotts] Не найден #pun-main для вставки сборщика');
    return;
  }
  var root = document.createElement('section');
  root.id = 'ssbc';
  root.className = 'ssbc-wrap';
  root.innerHTML = String.raw`
        <h3 class="ssbc-headline">Автоматический подсчет постов</h3>
        <p class="ssbc-intro">Выберите период и нажмите «Проверить».</p>
        <div class="ssbc-fields">
          <label>ID профиля игрока (число из profile.php?id=…)
            <input type="number" id="ssbc-target" min="2" step="1" placeholder="Например: 7">
          </label>
          <label>За какой период считать?
            <select id="ssbc-period">
              <option value="7">Последние 7 дней</option>
              <option value="30" selected>Последние 30 дней</option>
              <option value="90">Последние 90 дней</option>
              <option value="custom">Начиная с выбранной даты</option>
              <option value="all">Все посты (полный поиск по игровым разделам)</option>
            </select>
          </label>
          <label id="ssbc-custom" hidden>Начало периода
            <input type="date" id="ssbc-date">
          </label>
          <label>Текущий баланс выбранного профиля (необязательно)
            <input type="number" id="ssbc-balance" step="any" min="0" placeholder="Введите вручную">
          </label>
        </div>
        <button type="button" id="ssbc-scan" class="ssbc-button">Проверить</button>
        <div id="ssbc-progress" hidden>
          <div class="ssbc-progress-top">
            <span id="ssbc-progress-stage">Начинаю проверку…</span>
            <strong id="ssbc-progress-pct">0%</strong>
          </div>
          <progress id="ssbc-progress-bar" min="0" max="100" value="0" aria-label="Прогресс проверки"></progress>
        </div>
        <div id="ssbc-status" class="ssbc-status">Выберите игрока и период</div>
        <div id="ssbc-result" aria-live="polite"></div>
        <div id="ssbc-actions" hidden>
          <div class="ssbc-actions">
            <b id="ssbc-selected-total">К начислению: 0</b>
            <button type="button" id="ssbc-copy" class="ssbc-button ssbc-button-light">Скопировать BBCode</button>
            <button type="button" id="ssbc-insert" class="ssbc-button">Вставить в ответ темы №1364</button>
          </div>
          <textarea id="ssbc-text" readonly aria-label="Текст банковской заявки"></textarea>

        </div>`;
  if (firstPost) firstPost.insertAdjacentElement('beforebegin', root);
  else mountPoint.insertAdjacentElement('afterbegin', root);

  var CFG = {
    bankTopics: [20], // Единственный источник заявленных/оплаченных постов: действующий банк №20
    minChars: 1000,
    gameForums: {5: 30, 8: 30, 9: 10, 17: 30, 18: 30, 19: 10, 22: 30}, // 22: незавершённые, тариф выбирается отдельно по теме
    fastForums: new Set([8, 9, 18, 19, 22]), // f22 проверяется на быстрый ответ, бонус выдаётся лишь при ручной классификации темы как личной/альта
    fastExcludedTopics: new Set([687, 418]), // именно темы (не разделы); за посты платим, бонус +10 не даём
    fastBonus: 10,
    pageSize: 100,
    maxSkip: 1000, // предел одного обхода post.get; после него включается поиск по игровым темам
    groupedPageSize: 200,
    groupedMaxSkip: 2000, // ограничение API для group_by=topic_id
    topicPageSize: 100,
    topicMaxSkip: 10000, // актуальный предел topic.get; для сверхбольших форумов сообщаем об ошибке
    maxBankPages: 350,
    delayMs: 85,
    // Чтобы не перегрузить Rusff, исходники старых заявок читаются максимум по 2 одновременно.
    bankRawConcurrency: 2,
    bankRawDelayMs: 180
  };
  var $ = function (selector) { return root.querySelector(selector); };
  var currentAdminId = Number(window.UserID || 0);
  var userId = currentAdminId; // меняется по выбранному ID профиля при расчёте
  var userName = String(window.UserLogin || '');
  var state = { rows: [], used: new Map(), suspicious: [], claimDetails: new Map(), priorClaims: [], full: false, raw: '', historyCount: 0 };
  var bankHistoryCache = null; // только на время открытой страницы, без хранения на сервере/в localStorage
  // Прогресс отражает фактически обработанные страницы/заявки/эпизоды.
  // Этапы имеют веса; это доля выполненной работы, а не оценка оставшихся секунд.
  var progressValue = 0;
  function progressReset() {
    progressValue = 0;
    var box = $('#ssbc-progress');
    box.hidden = true;
    box.removeAttribute('data-state');
    $('#ssbc-progress-pct').textContent = '0%';
    $('#ssbc-progress-bar').value = 0;
    $('#ssbc-progress-stage').textContent = 'Начинаю проверку…';
  }
  function progressStart() {
    progressReset();
    $('#ssbc-progress').hidden = false;
    progressTo(0, 'Проверяю предыдущие заявки…');
  }
  function progressTo(value, label) {
    var n = Math.max(0, Math.min(100, Math.floor(Number(value) || 0)));
    progressValue = Math.max(progressValue, n); // процент никогда не уменьшается
    $('#ssbc-progress-bar').value = progressValue;
    $('#ssbc-progress-pct').textContent = progressValue + '%';
    if (label) $('#ssbc-progress-stage').textContent = label;
  }
  function progressDone() {
    progressTo(100, 'Проверка завершена');
    $('#ssbc-progress').dataset.state = 'done';
  }
  function progressFailed() {
    $('#ssbc-progress').dataset.state = 'error';
    $('#ssbc-progress-stage').textContent = 'Проверка остановлена';
  }

  var b = function (s) { return String(s == null ? '' : s); };
  var sleep = function (n) { return new Promise(function (done) { setTimeout(done, n); }); };

  // Формы слова «пост», включая уменьшительные формы и форумное «постописец».
  // Явно перечисленные окончания позволяют не путать «посты» с «постоянно», «постер» и «построить».
  var claimPostWord = /(?:^|[^\p{L}\p{N}_])пост(?:ы|ов|а|у|е|ом|ам|ами|ах|ик(?:и|ов|а|у|е|ом|ам|ами|ах)?|опис(?:ец|ца|цу|цем|цы|цев|цам|цами|цах))?(?=$|[^\p{L}\p{N}_])/iu;
  function mentionsPostWord(text) {
    return claimPostWord.test(b(text).replace(/\u00a0/g, ' '));
  }
  // ИСТОРИЯ В ИНТЕРФЕЙСЕ: только заявки, реально написанные выбранным профилем.
  // Это НЕ меняет общий реестр оплаченных игровых постов history.used:
  // ссылки из заявок ЛЮБЫХ профилей по-прежнему исключают повторный учёт.
  // Важно: не добавлять сюда чужие банковские сообщения только потому, что
  // в них встречается ссылка на пост проверяемого игрока.
  function getPriorClaims(history, targetId) {
    var authorId = Number(targetId);
    return (history.postClaimMessages || []).filter(function (entry) {
      return Number(entry.userId) === authorId;
    }).slice().sort(function (a, z) { return z.id - a.id; });
  }
  function renderPriorClaims(messages) {
    var html = '<section class="ssbc-oldclaims"><h4>Ваши предыдущие заявки на посты:</h4>';
    html += '<div class="ssbc-oldclaims-list">';
    if (!messages.length) html += '<p class="ssbc-small">Предыдущих заявок не найдено.</p>';
    else html += messages.map(function (entry) {
      return '<div class="ssbc-claim-entry"><a target="_blank" rel="noopener noreferrer" href="' +
        link(entry.id) + '">Заявка #' + entry.id + '</a></div>';
    }).join('');
    html += '</div></section>';
    return html;
  }
  var link = function (pid) { return '/viewtopic.php?pid=' + pid + '#p' + pid; };
  var show = function (message, kind) {
    var box = $('#ssbc-status');
    // Не показываем игроку ID банка, количество просмотренных сообщений и детали API.
    box.textContent = kind ? message : 'Идёт проверка постов и предыдущих заявок…';
    box.className = 'ssbc-status ' + (kind || '');
  };
  var dateOf = function (seconds) {
    return new Date(Number(seconds) * 1000).toLocaleDateString('ru-RU');
  };
  var escapeHtml = function (x) {
    return b(x).replace(/[&<>"']/g, function (c) {
      return ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c];
    });
  };

  // API возвращает {response:[...]}, а при ошибке другой объект — не считаем его пустым результатом.
  async function api(method, params) {
    var u = new URL('/api.php', location.origin);
    u.searchParams.set('method', method);
    u.searchParams.set('format', 'json');
    u.searchParams.set('charset', 'utf-8');
    Object.keys(params || {}).forEach(function (key) {
      u.searchParams.set(key, params[key]);
    });
    var response = await fetch(u.href, { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) throw new Error('API Rusff: HTTP ' + response.status + ' (' + method + ')');
    var json = await response.json();
    if (json.error || json.errors || !Object.prototype.hasOwnProperty.call(json, 'response')) {
      throw new Error('API Rusff не вернул данные (' + method + ')');
    }
    return json.response;
  }
  function array(v) {
    if (Array.isArray(v)) return v;
    if (v && Array.isArray(v.posts)) return v.posts;
    if (v && Array.isArray(v.topics)) return v.topics;
    return [];
  }

  // У заявок встречаются ссылки с id=ТЕМА#pПОСТ и pid=ПОСТ#pПОСТ.
  // Сравниваем всегда ID ПОСТА, а не полный адрес или id темы.
  // HTML-entities, экранирование слешей и BBCode допускаются.
  function decodeLinkMarkup(value) {
    var raw = b(value);
    for (var turn = 0; turn < 3; turn++) {
      var textarea = document.createElement('textarea');
      textarea.innerHTML = raw;
      var decoded = textarea.value;
      if (decoded === raw) break;
      raw = decoded;
    }
    return raw.replace(/\\([:/?#=&])/g, '$1')
      .replace(/[\u200b-\u200d\ufeff]/g, '')
      .replace(/\u00a0/g, ' ');
  }

  function postIdFromLink(href) {
    try {
      var clean = decodeLinkMarkup(href).trim()
        .replace(/^[\s'\"(<\[]+/, '')
        .replace(/[\s'\"\])>,.;!]+$/, '');
      // Старые [url=...] могли сохраниться буквально как BBCode.
      var bbUrl = clean.match(/^\[?url\s*=\s*([^\]\s]+)\]?/i);
      if (bbUrl) clean = bbUrl[1];
      var u = new URL(clean, location.origin);
      if (u.hostname.replace(/^www\./, '').toLowerCase() !== 'safespace.rusff.me') return null;
      if (!/\/(?:viewtopic\.php|post\.php)$/i.test(u.pathname)) return null;
      if (CFG.bankTopics.includes(Number(u.searchParams.get('id')))) return null;
      var hash = u.hash.match(/^#p(\d+)$/i);
      var pid = u.searchParams.get('pid');
      var hashId = hash ? Number(hash[1]) : 0;
      var queryId = pid && /^\d+$/.test(pid) ? Number(pid) : 0;
      // При противоречивых pid и #p ссылку нельзя считать доказательством.
      if (hashId && queryId && hashId !== queryId) return null;
      var id = hashId || queryId;
      return Number.isSafeInteger(id) && id > 0 ? id : null;
    } catch (e) { return null; }
  }

  function plainText(html) {
    var doc = new DOMParser().parseFromString('<div id="ssbc-parse">' + b(html) + '</div>', 'text/html');
    var el = doc.getElementById('ssbc-parse');
    // Текст чужой цитаты, исходники в [code] и скрытые шаблоны не считаются авторским игровым текстом.
    el.querySelectorAll('blockquote, .quote-box, .code-box, pre, code, script, style, .spoiler').forEach(function (x) { x.remove(); });
    el.querySelectorAll('br').forEach(function (x) { x.replaceWith('\n'); });
    return el.textContent.replace(/\u00a0/g, ' ').trim();
  }
  function charCount(html) {
    return Array.from(plainText(html)).length;
  }
  function claimData(html) {
    var doc = new DOMParser().parseFromString('<div id="ssbc-claim">' + b(html) + '</div>', 'text/html');
    var el = doc.getElementById('ssbc-claim');
    // Старые заявки иногда оформлялись целиком внутри [quote] или [code].
    // Для защиты от повторных заявок проверяем ВСЕ ссылки сообщения,
    // включая цитаты и спойлеры. Только скрипты/стили исключаем.
    el.querySelectorAll('script, style').forEach(function (x) { x.remove(); });
    var ids = new Set();
    el.querySelectorAll('a[href]').forEach(function (a) {
      var id = postIdFromLink(a.getAttribute('href'));
      if (id) ids.add(id);
    });
    // Ссылки встречаются как HTML, обычный текст, [url=...],
    // а иногда HTML из API экранирован: &lt;a href=&quot;...&quot;&gt;.
    var sources = [b(html), el.innerHTML, el.textContent];
    var seenRaw = new Set();
    sources.forEach(function (source) {
      var raw = decodeLinkMarkup(source);
      if (seenRaw.has(raw)) return;
      seenRaw.add(raw);
      // Абсолютные URL. Сначала извлекаем их целиком: ссылка на сторонний
      // сайт НЕ должна определиться по хвосту /viewtopic.php.
      var urls = raw.match(/(?:https?:\/\/|\/\/)[^\s\"'<>\[\]`]+/gi) || [];
      urls.forEach(function (url) {
        var id = postIdFromLink(url);
        if (id) ids.add(id);
      });
      // Относительные ссылки, например [url=viewtopic.php?pid=23990].
      var relative = /(?:^|[\s\"'=\[(])\/?(viewtopic\.php\?[^\s\"'<>\[\]`]+)/gim;
      var match;
      while ((match = relative.exec(raw))) {
        var relativeId = postIdFromLink(match[1]);
        if (relativeId) ids.add(relativeId);
      }
    });
    var text = el.textContent.replace(/\s+/g, ' ');
    // Заявки без прямых ссылок требуют ручной сверки.
    var uncertain = !ids.size && /(?:пост(?:ы|ов|а|ам|ами)?|альт(?:ернатив|ы)?|быстр(?:ый|ые|ого)\s+ответ|постописец)/i.test(text)
      && /(?:за что|сколько|зачисл|начисл|\+\s*\d|итогов|галлеон|\d+\s*(?:пост|шт))/i.test(text);
    return { ids: ids, uncertain: uncertain };
  }

  // Rusff отдает исходный BBCode на странице редактирования.
  // ВАЖНО: только GET, никакой отправки формы и никаких изменений постов.
  // Это принципиально отличается от анализа визуального HTML: внутри
  // [spoiler], [code] и [quote] все исходные [url=...] остаются в textarea.
  async function rawBankPost(bankPostId) {
    var addresses = ['/edit.php?id=' + bankPostId, '/edit.php?id=' + bankPostId + '&action=edit'];
    for (var attempt = 0; attempt < addresses.length; attempt++) {
      var response;
      try {
        response = await fetch(addresses[attempt], {credentials:'same-origin', cache:'no-store'});
        if (!response.ok) continue;
        var html = await response.text();
        var doc = new DOMParser().parseFromString(html, 'text/html');
        // Не доверяем произвольной textarea: требуется поле редактора сообщения.
        var input = doc.querySelector('textarea#main-reply, textarea[name="req_message"], textarea[name="message"]');
        if (!input) continue;
        var value = input.value || input.textContent || '';
        if (value.trim()) return value;
      } catch (e) {
        // Пробуем поддерживаемый альтернативный URL. Ни один вариант не пишет данные.
      }
    }
    throw new Error('Исходный BBCode заявки #' + bankPostId +
      ' не прочитан из edit.php. Возможно, у аккаунта нет прав редактирования чужих постов или сработала защита Rusff. Чтобы не считать уже оплаченные посты повторно, расчёт остановлен.');
  }

  // Читаем ВСЕ ответы банка, а не только заявки со словом "пост".
  // Эвристики ненадёжны: часть длинных заявок скрыта целиком под спойлером.
  async function allRawBankPosts(bankPostIds, topicId) {
    var result = new Map();
    var cursor = 0;
    var finished = 0;
    var failure = null;
    var workers = Math.min(CFG.bankRawConcurrency, bankPostIds.length);
    async function worker() {
      while (cursor < bankPostIds.length && !failure) {
        var id = bankPostIds[cursor++];
        try {
          result.set(id, await rawBankPost(id));
          finished++;
          progressTo(18 + 47 * finished / Math.max(bankPostIds.length, 1),
            'Проверка предыдущих заявок: ' + finished + ' из ' + bankPostIds.length);
          if (finished === 1 || finished % 10 === 0 || finished === bankPostIds.length)
            show('Исходный BBCode банка №' + topicId + ': проверено ' + finished + ' из ' + bankPostIds.length + ' старых заявок…');
        } catch (e) {
          failure = e;
        }
        if (!failure) await sleep(CFG.bankRawDelayMs);
      }
    }
    await Promise.all(Array.from({length: workers}, worker));
    if (failure) throw failure;
    if (result.size !== bankPostIds.length)
      throw new Error('Получены не все исходные заявки банка №' + topicId + '. Расчёт отменён.');
    return result;
  }

  async function bankTopicInfo(topicId) {
    var data = array(await api('topic.get', {
      topic_id: topicId, fields: 'id,forum_id,num_replies,init_post,first_post', limit: 1
    }));
    if (!data.length) throw new Error('Тема №' + topicId + ' не найдена через API. Для скрытой темы требуются права доступа АМС.');
    return data[0];
  }

  // Сверяем ВСЮ историю банка №20 тремя источниками: API, HTML и исходный BBCode.
  // Иначе спойлер, скрытый в HTML и от API, может дать повторное начисление.
  async function bankHistoryOne(topicId) {
    var topic = await bankTopicInfo(topicId);
    var expected = Number(topic.num_replies) + 1;
    if (!Number.isSafeInteger(expected) || expected < 1)
      throw new Error('Не удалось определить количество сообщений темы №' + topicId);
    var apiRows = [];
    if (expected <= CFG.maxSkip + CFG.pageSize) {
      for (var skip = 0; skip < expected; skip += CFG.pageSize) {
        show('API банка №' + topicId + ': проверяю ' + Math.min(skip + CFG.pageSize, expected) + ' из ' + expected + ' сообщений…');
        var page = array(await api('post.get', {
          topic_id: topicId, fields: 'id,user_id,username,message,posted,topic_id',
          sort_by: 'posted', sort_dir: 'asc', skip: skip, limit: CFG.pageSize
        }));
        apiRows.push.apply(apiRows, page);
        progressTo(8 * Math.min(apiRows.length, expected) / expected, 'Получаю историю банка…');
        if (!page.length) break;
        await sleep(CFG.delayMs);
      }
    }
    var htmlRows = await bankHistoryFromPages(expected, topicId);
    var htmlById = new Map(htmlRows.map(function (p) { return [Number(p.id), p]; }));
    if (htmlById.size !== expected)
      throw new Error('HTML банка №' + topicId + ' прочитан не полностью: ' + htmlById.size +
        ' из ' + expected + ' сообщений. Расчёт остановлен.');
    var apiById = new Map(apiRows.map(function (p) { return [Number(p.id), p]; }));
    if (apiRows.length && (apiById.size !== expected ||
        Array.from(apiById.keys()).some(function (id) { return !htmlById.has(id); }))) {
      throw new Error('Списки сообщений API и HTML банка №' + topicId +
        ' не совпадают. Расчёт остановлен для проверки истории.');
    }
    var firstId = Number(topic.init_post) || Number(topic.first_post) ||
      Math.min.apply(null, Array.from(htmlById.keys()));
    var idsToAudit = Array.from(htmlById.keys()).filter(function (id) { return id !== firstId; });
    // Ключевое изменение: НЕ считаем HTML/API единственным источником ссылок.
    var rawById = await allRawBankPosts(idsToAudit, topicId);
    var used = new Map();
    var uncertain = [];
    var claimDetails = new Map();
    var postClaimMessages = [];
    var restoredFromRaw = 0;
    htmlById.forEach(function (htmlPost, bankPostId) {
      if (bankPostId === firstId) return;
      var apiPost = apiById.get(bankPostId);
      var htmlData = claimData(htmlPost.message || '');
      var apiData = apiPost ? claimData(apiPost.message || '') : {ids:new Set(), uncertain:false};
      var rawData = claimData(rawById.get(bankPostId));
      var seenInRender = new Set([...htmlData.ids, ...apiData.ids]);
      var ids = new Set([...seenInRender, ...rawData.ids]);
      rawData.ids.forEach(function (id) { if (!seenInRender.has(id)) restoredFromRaw++; });
      var author = b((apiPost && apiPost.username) || htmlPost.username || '');
      var apiAuthorId = Number(apiPost && apiPost.user_id) || 0;
      var htmlAuthorId = Number(htmlPost.user_id) || 0;
      // При противоречии между двумя источниками не приписываем заявку
      // ни одному профилю, но все её ссылки сохраняем для защиты от дублей.
      var bankAuthorId = apiAuthorId && htmlAuthorId && apiAuthorId !== htmlAuthorId
        ? 0 : (apiAuthorId || htmlAuthorId);
      // Список прежних заявок составляем по ВСЕМ исходным сообщениям банка,
      // а не только по сообщениям с распознанными ссылками на игровые посты.
      if ([rawById.get(bankPostId), htmlPost.message, apiPost && apiPost.message]
          .some(mentionsPostWord)) {
        postClaimMessages.push({id: bankPostId, author: author,
          userId: bankAuthorId});
      }
      claimDetails.set(bankPostId, {
        ids:ids, htmlIds:htmlData.ids, apiIds:apiData.ids, rawIds:rawData.ids,
        htmlLength:b(htmlPost.message).length,
        apiLength:apiPost ? b(apiPost.message).length : null,
        rawLength:b(rawById.get(bankPostId)).length, author:author
      });
      ids.forEach(function (id) {
        if (!used.has(id)) used.set(id, {bankPostId:bankPostId, topicId:topicId, author:author});
      });
      if (!ids.size && (htmlData.uncertain || apiData.uncertain || rawData.uncertain)) {
        uncertain.push({id:bankPostId, topicId:topicId,
          userId:bankAuthorId, author:author});
      }
    });
    return {used:used, suspicious:uncertain, historyCount:htmlById.size - 1,
      rawCount:rawById.size, restoredFromRaw:restoredFromRaw, claimDetails:claimDetails,
      postClaimMessages:postClaimMessages};
  }

  async function bankHistory() {
    // В течение одной открытой страницы не читаем сотни исходников заново.
    // Перезагрузка вкладки сбрасывает кэш и читает обновлённые заявления.
    if (bankHistoryCache) {
      progressTo(65, 'История банка уже проверена');
      return bankHistoryCache;
    }
    var used = new Map();
    var suspicious = [];
    var historyCount = 0;
    var rawCount = 0;
    var restoredFromRaw = 0;
    var claimDetails = new Map();
    var postClaimMessages = [];
    for (var topicId of CFG.bankTopics) {
      var h = await bankHistoryOne(topicId);
      h.used.forEach(function (value, key) { if (!used.has(key)) used.set(key, value); });
      h.claimDetails.forEach(function (value, key) { claimDetails.set(key, value); });
      postClaimMessages.push.apply(postClaimMessages, h.postClaimMessages);
      suspicious.push.apply(suspicious, h.suspicious);
      historyCount += h.historyCount;
      rawCount += h.rawCount;
      restoredFromRaw += h.restoredFromRaw;
    }
    progressTo(65, 'История предыдущих заявок проверена');
    bankHistoryCache = {used:used, suspicious:suspicious, historyCount:historyCount,
      claimDetails:claimDetails, rawCount:rawCount, restoredFromRaw:restoredFromRaw,
      postClaimMessages:postClaimMessages};
    return bankHistoryCache;
  }

  // HTML видят сами пользователи под аккаунтом АМС; читаем страницы последовательно.
  // ВАЖНО: блоки [code], [quote], спойлеры и ссылки сохраняем, не чистим HTML.
  async function bankHistoryFromPages(expected, topicId) {
    var all = new Map();
    var stagnant = 0;
    for (var p = 1; p <= CFG.maxBankPages; p++) {
      show('HTML банка №' + topicId + ': страница ' + p + ', прочитано ' + all.size + ' из ' + expected + '…');
      var resp = await fetch('/viewtopic.php?id=' + topicId + '&p=' + p,
        {credentials:'same-origin', cache:'no-store'});
      if (!resp.ok) throw new Error('Не удалось открыть страницу ' + p + ' банка №' + topicId + ': HTTP ' + resp.status);
      var html = await resp.text();
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var nodes = doc.querySelectorAll('.post[id]');
      var before = all.size;
      nodes.forEach(function (post) {
        var idm = (post.id || '').match(/^(?:p|post)(\d+)$/i);
        if (!idm) return;
        var content = post.querySelector('.post-content') || post.querySelector('.post-body');
        if (!content) return;
        var uname = post.querySelector('.pa-author a[href*="profile.php"], .pa-author a');
        var userId = Number(post.getAttribute('data-user-id')) || 0;
        if (!userId && uname) {
          try {
            var authorUrl = new URL(uname.getAttribute('href'), location.origin);
            if (/\/profile\.php$/i.test(authorUrl.pathname))
              userId = Number(authorUrl.searchParams.get('id')) || 0;
          } catch (e) { /* Если URL автора неизвестен, используем ID из API. */ }
        }
        all.set(Number(idm[1]), {id:Number(idm[1]), message:content.innerHTML,
          user_id:userId, username:uname ? uname.textContent : ''});
      });
      progressTo(8 + 10 * Math.min(all.size, expected) / expected,
        'Проверяю страницы старого банка: ' + all.size + ' из ' + expected);
      if (all.size >= expected) break;
      stagnant = all.size === before ? stagnant + 1 : 0;
      if (stagnant >= 2) break;
      await sleep(CFG.delayMs);
    }
    return Array.from(all.values());
  }

  // Оптимизированный поиск эпизодов, в которых участвовал игрок.
  // Группировка по topic_id поддерживается Rusff API, но старые версии
  // сервиса могут не поддерживать её: в таком случае сканируем список
  // ВСЕХ тем семи игровых разделов (а не пропускаем часть сообщений).
  async function userTopicsByGrouping(knownGamePosts) {
    try {
      var topicIds = new Set();
      var isComplete = false;
      for (var skip = 0; skip <= CFG.groupedMaxSkip; skip += CFG.groupedPageSize) {
        show('Постов автора больше 1100. Ищу его эпизоды, группа ' + (Math.floor(skip / CFG.groupedPageSize) + 1) + '…');
        var page = array(await api('post.get', {
          user_id: userId, group_by: 'topic_id', fields: 'id,topic_id,user_id',
          sort_by: 'id', sort_dir: 'desc', skip: skip, limit: CFG.groupedPageSize
        }));
        progressTo(70 + 5 * Math.min(skip + page.length, CFG.groupedMaxSkip + CFG.groupedPageSize) /
          (CFG.groupedMaxSkip + CFG.groupedPageSize), 'Поиск игровых эпизодов игрока…');
        var ids = page.map(function (p) { return Number(p.topic_id); });
        // При игнорировании group_by могут повторяться темы. Не доверяем
        // такому ответу — переключаемся на полный обход игровых разделов.
        if (ids.some(function (id) { return !Number.isSafeInteger(id) || id < 1 || topicIds.has(id); }) ||
            new Set(ids).size !== ids.length) return null;
        ids.forEach(function (id) { topicIds.add(id); });
        if (page.length < CFG.groupedPageSize) { isComplete = true; break; }
        await sleep(CFG.delayMs);
      }
      if (!isComplete) return null; // автор участвовал более чем в 2200 темах
      // Проверяем, что группировка содержит хотя бы все игровые эпизоды
      // уже прочитанной части истории автора.
      if (knownGamePosts.some(function (p) { return !topicIds.has(Number(p.topic_id)); })) return null;
      var topics = [];
      var ids = Array.from(topicIds);
      for (var i = 0; i < ids.length; i += 75) {
        var part = ids.slice(i, i + 75);
        var response = array(await api('topic.get', {
          topic_id: part.join(','), fields: 'id,forum_id', limit: 100
        }));
        if (response.length !== part.length ||
            new Set(response.map(function (t) { return Number(t.id); })).size !== part.length) return null;
        response.forEach(function (topic) {
          if (Object.prototype.hasOwnProperty.call(CFG.gameForums, Number(topic.forum_id))) topics.push(topic);
        });
        await sleep(CFG.delayMs);
      }
      return topics;
    } catch (e) {
      // Не считаем группировку обязательной функцией API.
      // Ошибки главного, полного способа поиска не подавляются.
      return null;
    }
  }

  // Запасной полный режим: все темы необходимых игровых разделов.
  // Лимит в 1100 сообщений АВТОРА здесь отсутствует: он не применяется
  // ко всей истории, каждая тема просматривается отдельно.
  async function allGameTopics() {
    var collected = new Map();
    var forums = Object.keys(CFG.gameForums);
    for (var f = 0; f < forums.length; f++) {
      var forumId = Number(forums[f]);
      var complete = false;
      for (var skip = 0; skip <= CFG.topicMaxSkip; skip += CFG.topicPageSize) {
        show('Полный поиск: темы раздела f' + forumId + ', просмотрено ' + skip + '…');
        var page = array(await api('topic.get', {
          forum_id: forumId, fields: 'id,forum_id', sort_by: 'id',
          sort_dir: 'desc', skip: skip, limit: CFG.topicPageSize
        }));
        progressTo(75 + 5 * (f + Math.min(skip + page.length, CFG.topicMaxSkip + CFG.topicPageSize) /
          (CFG.topicMaxSkip + CFG.topicPageSize)) / forums.length, 'Поиск игровых разделов…');
        for (var i = 0; i < page.length; i++) {
          var t = page[i];
          var tid = Number(t.id);
          if (!Number.isSafeInteger(tid) || tid < 1 || Number(t.forum_id) !== forumId || collected.has(tid)) {
            throw new Error('Получен некорректный или повторный список эпизодов раздела f' + forumId + '. Расчёт остановлен во избежание пропусков.');
          }
          collected.set(tid, t);
        }
        if (page.length < CFG.topicPageSize) { complete = true; break; }
        await sleep(CFG.delayMs);
      }
      if (!complete) throw new Error('Раздел f' + forumId + ' содержит слишком много тем для API. Расчёт остановлен без неполных данных.');
    }
    return Array.from(collected.values());
  }

  async function userPostsFromGameTopics(sinceTimestamp, knownGamePosts) {
    var topics = await userTopicsByGrouping(knownGamePosts);
    if (!topics) {
      show('Группировка API недоступна или неполная. Перехожу к полному обходу игровых разделов…');
      topics = await allGameTopics();
    }
    progressTo(80, 'Список игровых эпизодов получен');
    var found = new Map();
    var tooLong = [];
    for (var index = 0; index < topics.length; index++) {
      var t = topics[index];
      var tid = Number(t.id);
      var forumId = Number(t.forum_id);
      // Не перегружаем API: последовательно читаем посты одного эпизода.
      show('Полный поиск: эпизод ' + (index + 1) + ' из ' + topics.length + ' (№' + tid + '), найдено ' + found.size + '…');
      var complete = false;
      for (var skip = 0; skip <= CFG.maxSkip; skip += CFG.pageSize) {
        var page = array(await api('post.get', {
          topic_id: tid, fields: 'id,user_id,username,forum_id,topic_id,message,posted',
          sort_by: 'posted', sort_dir: 'desc', skip: skip, limit: CFG.pageSize
        }));
        if (page.some(function (p) { return Number(p.topic_id) !== tid; })) {
          throw new Error('API вернул посты из другого эпизода вместо №' + tid);
        }
        page.forEach(function (post) {
          if (Number(post.user_id) !== userId || Number(post.posted) < sinceTimestamp) return;
          var id = Number(post.id);
          if (!Number.isSafeInteger(id) || id < 1) return;
          post.forum_id = forumId;
          found.set(id, post);
        });
        // По возрастанию skip и убыванию даты: ранние сообщения дальше не нужны.
        if (page.length < CFG.pageSize ||
            page.some(function (p) { return Number(p.posted) < sinceTimestamp; })) {
          complete = true;
          break;
        }
        await sleep(CFG.delayMs);
      }
      // Очень длинный отдельный эпизод нельзя молча обрезать.
      if (!complete) tooLong.push(tid);
      progressTo(80 + 10 * (index + 1) / Math.max(topics.length, 1),
        'Проверяю игровые эпизоды: ' + (index + 1) + ' из ' + topics.length);
      await sleep(CFG.delayMs);
    }
    if (tooLong.length) {
      throw new Error('Есть эпизоды с более чем 1100 сообщениями: ' + tooLong.join(', ') + '. API не отдал их полностью, поэтому расчёт остановлен, а не показал неполную сумму.');
    }
    // Страховка от несовместимого API group_by или пропуска архива:
    // каждый уже найденный игровой пост обязан присутствовать в обходе тем.
    if (knownGamePosts.some(function (p) { return !found.has(Number(p.id)); })) {
      throw new Error('Полный обход не совпал с исходной выборкой: найденные ранее игровые посты отсутствуют. Проверь доступность разделов и API.');
    }
    progressTo(90, 'Игровые посты найдены');
    return Array.from(found.values()).sort(function (a, b) {
      return Number(b.posted) - Number(a.posted) || Number(b.id) - Number(a.id);
    });
  }

  async function userPosts(sinceTimestamp) {
    var result = [];
    for (var skip = 0; skip <= CFG.maxSkip; skip += CFG.pageSize) {
      show('Ищу игровые посты: проверено ' + skip + ' сообщений автора…');
      var posts = array(await api('post.get', {
        user_id: userId, fields: 'id,user_id,username,forum_id,topic_id,message,posted',
        sort_by: 'posted', sort_dir: 'desc', skip: skip, limit: CFG.pageSize
      }));
      if (posts.some(function (p) { return Number(p.user_id) !== userId; })) {
        throw new Error('API вернул сообщения других пользователей — поиск остановлен.');
      }
      var reachedStart = false;
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        if (Number(post.posted) < sinceTimestamp) { reachedStart = true; break; }
        if (!Object.prototype.hasOwnProperty.call(CFG.gameForums, Number(post.forum_id))) continue;
        result.push(post);
      }
      progressTo(65 + 5 * Math.min(skip + posts.length, CFG.maxSkip + CFG.pageSize) /
        (CFG.maxSkip + CFG.pageSize), 'Поиск игровых постов игрока…');
      if (reachedStart || posts.length < CFG.pageSize) {
        progressTo(90, 'Игровые посты найдены');
        return result;
      }
      await sleep(CFG.delayMs);
    }
    // Прежняя версия здесь останавливалась с сообщением «лимит 1100».
    // Теперь переходим к отдельному обходу игровых эпизодов без общего
    // предела на количество сообщений профиля.
    return userPostsFromGameTopics(sinceTimestamp, result);
  }

  // Вычисление быстрых ответов и исключение стартовых сообщений эпизодов.
  async function topicContext(rows, fastEnabled) {
    var topics = Array.from(new Set(rows.map(function (p) { return Number(p.topic_id); })));
    var info = new Map();
    for (var i = 0; i < topics.length; i += 75) {
      var ids = topics.slice(i, i + 75);
      var list = array(await api('topic.get', {
        topic_id: ids.join(','), fields: 'id,forum_id,init_post,first_post', limit: 100
      }));
      list.forEach(function (t) { info.set(Number(t.id), t); });
      await sleep(CFG.delayMs);
    }
    var grouped = new Map();
    rows.forEach(function (post) {
      var tid = Number(post.topic_id);
      if (!grouped.has(tid)) grouped.set(tid, []);
      grouped.get(tid).push(post);
    });
    var starters = new Set();
    var quick = new Set();
    var needsReview = [];
    var checkedTopics = 0;
    for (var t of topics) {
      progressTo(90 + 9 * checkedTopics / Math.max(topics.length, 1),
        'Проверяю быстрые ответы и стартовые посты: ' + checkedTopics + ' из ' + topics.length);
      checkedTopics++;
      var target = grouped.get(t);
      var known = info.get(t);
      if (!known) {
        needsReview.push('Не удалось получить данные эпизода №' + t);
        // Исключаем посты темы целиком, если не можем проверить, что они не стартовые.
        target.forEach(function (p) { starters.add(Number(p.id)); });
        continue;
      }
      var firstId = Number(known.init_post) || Number(known.first_post) || 0;
      if (firstId) starters.add(firstId);
      // Для сюжетных эпизодов суточный бонус не предусмотрен (включая архив f17).
      var canFast = fastEnabled && !CFG.fastExcludedTopics.has(t) && target.some(function (p) {
        return CFG.fastForums.has(Number(p.forum_id));
      });
      if (!canFast && firstId) continue;
      // Чтобы проверить быстрый ответ, нужны соседние сообщения из этой темы.
      // Заодно определяем ID самого первого поста, если topic.get не дал его.
      var all = [];
      var minTs = Math.min.apply(null, target.map(function (p) { return Number(p.posted); }));
      var complete = false;
      for (var skip = 0; skip <= CFG.maxSkip; skip += CFG.pageSize) {
        show('Проверяю быстрые ответы: эпизод №' + t + '…');
        var page = array(await api('post.get', {
          topic_id: t, fields: 'id,user_id,posted,topic_id', sort_by: 'posted',
          sort_dir: 'desc', skip: skip, limit: CFG.pageSize
        }));
        all.push.apply(all, page);
        if (page.length < CFG.pageSize || (page.length && Number(page[page.length - 1].posted) < minTs)) {
          complete = true; break;
        }
        await sleep(CFG.delayMs);
      }
      if (!complete) {
        needsReview.push('Длинный эпизод №' + t + ': бонус за быстрые ответы не рассчитан');
      }
      all.sort(function (a, z) { return Number(a.posted) - Number(z.posted) || Number(a.id) - Number(z.id); });
      if (!firstId && complete && all.length) starters.add(Number(all[0].id));
      if (!firstId && !complete) {
        target.forEach(function (p) { starters.add(Number(p.id)); });
        needsReview.push('Эпизод №' + t + ': не удалось надёжно исключить стартовый пост');
      }
      if (canFast && complete) {
        var index = new Map(all.map(function (post, n) { return [Number(post.id), n]; }));
        target.forEach(function (post) {
          if (!CFG.fastForums.has(Number(post.forum_id)) || CFG.fastExcludedTopics.has(Number(post.topic_id))) return;
          var pos = index.get(Number(post.id));
          if (pos == null || pos < 1) return;
          var prev = all[pos - 1];
          var diff = Number(post.posted) - Number(prev.posted);
          if (Number(prev.user_id) !== userId && diff >= 0 && diff <= 86400) quick.add(Number(post.id));
        });
      }
      await sleep(CFG.delayMs);
    }
    progressTo(99, 'Формирую расчёт и ссылки на посты…');
    return { starters: starters, quick: quick, needsReview: needsReview };
  }

  function selectedDate() {
    var period = $('#ssbc-period').value;
    if (period === 'all') return 0;
    if (period === 'custom') {
      var raw = $('#ssbc-date').value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error('Укажи дату начала периода.');
      var date = new Date(raw + 'T00:00:00');
      if (!Number.isFinite(date.getTime())) throw new Error('Неверная дата.');
      return Math.floor(date.getTime() / 1000);
    }
    return Math.floor(Date.now() / 1000) - Number(period) * 86400;
  }
  function initialBalance() {
    var value = b(window.UserFld5 || '0').replace(/\s+/g, '').replace(',', '.');
    var n = Number(value.replace(/[^\d.\-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }
  function money(n) {
    return new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 2}).format(n);
  }
  function newResult(rows, ctx, history) {
    var usedRows = [];
    var tooShort = [];
    var newRows = [];
    rows.forEach(function (p) {
      var id = Number(p.id);
      if (ctx.starters.has(id)) return;
      var len = charCount(p.message);
      if (len < CFG.minChars) { tooShort.push(p); return; }
      if (history.used.has(id)) { usedRows.push(p); return; }
      var unfinished = Number(p.forum_id) === 22;
      var mayBeFast = !CFG.fastExcludedTopics.has(Number(p.topic_id)) && ctx.quick.has(id);
      // f22 объединяет незавершённые эпизоды разных видов.
      // Нельзя без оснований назначать им ни +30, ни +10, ни суточный бонус.
      var base = unfinished ? 0 : CFG.gameForums[Number(p.forum_id)];
      var fast = !unfinished && CFG.fastForums.has(Number(p.forum_id)) && mayBeFast ? CFG.fastBonus : 0;
      newRows.push({id: id, posted: p.posted, length: len, forum: Number(p.forum_id),
        topic: Number(p.topic_id), type: unfinished ? 'unknown' : 'normal',
        mayBeFast: mayBeFast, base: base, fast: fast, sum: base + fast});
    });
    newRows.sort(function (a, z) { return Number(a.posted) - Number(z.posted); });
    state.rows = newRows;
    state.used = history.used;
    state.suspicious = history.suspicious;
    state.claimDetails = history.claimDetails;
    state.historyCount = history.historyCount;
    state.priorClaims = getPriorClaims(history, userId);
    state.full = true;
    var total = newRows.reduce(function (acc, p) { return acc + p.sum; }, 0);
    var html = renderPriorClaims(state.priorClaims);
    html += '<section class="ssbc-oldclaims" aria-label="Новые посты"><h4>Новые посты:</h4>';
    html += '<div class="ssbc-summary"><b>Новых постов: ' + newRows.length + '</b><br>' +
      '<b id="ssbc-new-total">К начислению: +' + money(total) + ' галлеонов</b>' +
      '<div id="ssbc-balance-preview" class="ssbc-small"></div></div>';
    // Техническая статистика, перечень уже использованных ссылок и диагностика
    // остаются внутри расчёта, не загромождая страницу игрока.
    if (history.suspicious.length || ctx.needsReview.length) {
      console.info('[Gringotts] Требуется дополнительная сверка:', {
        oldClaimsWithoutLinks: history.suspicious.length,
        gameTopicsNeedingReview: ctx.needsReview.slice()
      });
    }
    var unfinishedTopics = Array.from(new Set(newRows.filter(function (p) { return p.forum === 22; })
      .map(function (p) { return p.topic; })));
    if (unfinishedTopics.length) {
      html += '<section class="ssbc-oldclaims"><h4>Незавершённые эпизоды</h4>' +
        '<p class="ssbc-small">Посты из раздела №22 найдены. Укажите тип каждого эпизода: тариф и суточный бонус зависят от него.</p>';
      unfinishedTopics.forEach(function (topicId) {
        html += '<div class="ssbc-type-row"><a target="_blank" rel="noopener" href="/viewtopic.php?id=' + topicId + '">Эпизод №' + topicId + '</a>' +
          '<select data-ssbc-topic-type="' + topicId + '" aria-label="Тип незавершённого эпизода №' + topicId + '">' +
          '<option value="unknown">Выберите тип эпизода</option>' +
          '<option value="plot">Сюжетный: +30, без быстрого бонуса</option>' +
          '<option value="personal">Личный: +30, быстрый +10</option>' +
          '<option value="alt">Альтернатива: +10, быстрый +10</option>' +
          '</select></div>';
      });
      html += '</section>';
    }
    html += '<div class="ssbc-rows">';
    newRows.forEach(function (p) {
      html += '<div class="ssbc-row"><label><input type="checkbox" data-post="' + p.id + '" checked>' +
        ' <a href="' + link(p.id) + '" target="_blank" rel="noopener">Пост #' + p.id + '</a>' +
        ' <small id="ssbc-kind-' + p.id + '">' + dateOf(p.posted) + ' · ' + p.length + ' симв. · ' +
        (p.forum === 22 ? 'Незавершённый, выберите тип' : ([9, 19].includes(p.forum) ? 'Альтернатива' : 'Игра')) +
        (p.fast ? ' · быстрый ответ' : '') + '</small></label><b id="ssbc-price-' + p.id + '">' +
        (p.forum === 22 ? '—' : '+' + p.sum) + '</b></div>';
    });
    if (!newRows.length) html += '<p>Новых подходящих постов за этот период нет.</p>';
    html += '</div></section>';
    if (history.suspicious.length) {
      html += '<label class="ssbc-confirm"><input type="checkbox" id="ssbc-reviewed"> ' +
        'Я проверил(а) предыдущие заявки без ссылок и подтвердил(а), что новые посты ещё не оплачены</label>';
    }
    if (ctx.needsReview.length) {
      html += '<p class="ssbc-small">Некоторые эпизоды требуют ручной проверки; убедитесь, что все выбранные посты подходят для начисления.</p>';
    }
    $('#ssbc-result').innerHTML = html;
    $('#ssbc-actions').hidden = false;
    buildBBCode();
    $('#ssbc-result').querySelectorAll('input[type="checkbox"], select[data-ssbc-topic-type]').forEach(function (input) {
      input.addEventListener('change', buildBBCode);
    });
    show('Расчёт готов.', 'ok');
  }

  function buildBBCode() {
    if (!state.full) return '';
    var checked = Array.from($('#ssbc-result').querySelectorAll('input[data-post]:checked'))
      .map(function (x) { return Number(x.dataset.post); });
    var typeByTopic = new Map();
    $('#ssbc-result').querySelectorAll('select[data-ssbc-topic-type]').forEach(function (el) {
      typeByTopic.set(Number(el.dataset.ssbcTopicType), el.value);
    });
    state.rows.forEach(function (r) {
      if (r.forum !== 22) return;
      r.type = typeByTopic.get(r.topic) || 'unknown';
      r.base = r.type === 'alt' ? 10 : (r.type === 'unknown' ? 0 : 30);
      r.fast = (r.type === 'alt' || r.type === 'personal') && r.mayBeFast ? CFG.fastBonus : 0;
      r.sum = r.base + r.fast;
      var price = $('#ssbc-price-' + r.id);
      var kind = $('#ssbc-kind-' + r.id);
      if (price) price.textContent = r.type === 'unknown' ? '—' : ('+' + r.sum);
      if (kind) kind.textContent = dateOf(r.posted) + ' · ' + r.length + ' симв. · ' +
        ({unknown:'Незавершённый, выберите тип', plot:'Сюжетный',personal:'Личный',alt:'Альтернатива'}[r.type]) +
        (r.fast ? ' · быстрый ответ' : '');
    });
    var selected = state.rows.filter(function (r) { return checked.includes(r.id); });
    var game = selected.filter(function (r) { return r.base === 30; });
    var alt = selected.filter(function (r) { return r.base === 10; });
    var fast = selected.filter(function (r) { return r.fast; });
    var total = selected.reduce(function (n, row) { return n + row.sum; }, 0);
    var unresolved = selected.filter(function (r) { return r.forum === 22 && r.type === 'unknown'; });
    var totalLabel = $('#ssbc-new-total');
    if (totalLabel) totalLabel.textContent = unresolved.length
      ? 'Выберите тип незавершённых эпизодов (' + unresolved.length + ' постов)' :
      'К начислению: +' + money(total) + ' галлеонов';
    if (unresolved.length) {
      state.raw = '';
      $('#ssbc-text').value = 'Укажите тип незавершённых эпизодов или снимите с их постов галочки.';
      $('#ssbc-copy').disabled = true;
      $('#ssbc-insert').disabled = true;
      $('#ssbc-selected-total').textContent = 'Требуется выбрать тип незавершённых эпизодов';
      return '';
    }
    var lines = ['[b]Профиль:[/b] [url=' + location.origin + '/profile.php?id=' + userId + ']' +
      userName.replace(/[\[\]]/g, '') + '[/url] (ID ' + userId + ')',
      '', '[b]Ваши предыдущие заявки на посты:[/b]'];
    if (state.priorClaims.length) {
      state.priorClaims.forEach(function (entry) {
        lines.push('[url=' + location.origin + link(entry.id) + ']Заявка #' + entry.id + '[/url]');
      });
    } else {
      lines.push('Предыдущих заявок не найдено.');
    }
    lines.push('', '[b]Новые посты:[/b]');
    if (game.length) {
      lines.push('', '[b]Основная / сюжетная игра (' + game.length + ' × 30):[/b]');
      game.forEach(function (p) { lines.push('[url=' + location.origin + link(p.id) + ']Пост #' + p.id + '[/url] — 30'); });
    }
    if (alt.length) {
      lines.push('', '[b]Альтернатива (' + alt.length + ' × 10):[/b]');
      alt.forEach(function (p) { lines.push('[url=' + location.origin + link(p.id) + ']Пост #' + p.id + '[/url] — 10'); });
    }
    if (fast.length) {
      lines.push('', '[b]Быстрые ответы (' + fast.length + ' × 10):[/b]');
      fast.forEach(function (p) { lines.push('[url=' + location.origin + link(p.id) + ']Быстрый ответ #' + p.id + '[/url] — 10'); });
    }
    lines.push('', '[b]Сколько:[/b] +' + total);
    var balanceRaw = $('#ssbc-balance').value.trim();
    if (balanceRaw !== '') {
      var balance = Number(balanceRaw);
      if (Number.isFinite(balance)) lines.push('[b]Итоговая сумма:[/b] ' + money(balance + total).replace(/\u00a0/g, ' '));
    } else {
      lines.push('[b]Итоговая сумма:[/b] [заполнить вручную после проверки баланса]');
    }
    var preview = $('#ssbc-balance-preview');
    if (preview) preview.textContent = balanceRaw !== '' && Number.isFinite(Number(balanceRaw))
      ? 'Текущий баланс: ' + money(Number(balanceRaw)) + ' · После начисления: ' + money(Number(balanceRaw) + total)
      : 'Текущий баланс не указан; итоговый остаток заполняется вручную.';
    state.raw = lines.join('\n');
    $('#ssbc-text').value = state.raw;
    $('#ssbc-selected-total').textContent = 'К начислению: +' + money(total);
    var confirm = $('#ssbc-reviewed');
    var blocked = !!confirm && !confirm.checked;
    var hasContent = selected.length > 0 || state.priorClaims.length > 0;
    $('#ssbc-copy').disabled = blocked || !hasContent;
    $('#ssbc-insert').disabled = blocked || !hasContent;
    return state.raw;
  }
  async function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    $('#ssbc-text').focus();
    $('#ssbc-text').select();
    if (!document.execCommand('copy')) throw new Error('Не удалось скопировать. Выдели текст заявки вручную.');
  }

  async function calculate() {
    var selectedId = Number($('#ssbc-target').value);
    if (!Number.isSafeInteger(selectedId) || selectedId < 2) {
      show('Введи числовой ID профиля игрока (не меньше 2).', 'error'); return;
    }
    userId = selectedId;
    userName = userId === currentAdminId ? String(window.UserLogin || '') : ('Профиль #' + userId);
    var btn = $('#ssbc-scan');
    btn.disabled = true;
    state.full = false;
    state.priorClaims = [];
    $('#ssbc-actions').hidden = true;
    $('#ssbc-result').innerHTML = '';
    progressStart();
    try {
      var since = selectedDate();
      var fast = true; // Автоматически проверяем ответы ≤24 часов в разрешённых разделах.
      show('Сверяю старые заявки только в теме №20…');
      var history = await bankHistory();
      state.claimDetails = history.claimDetails;
      var posts = await userPosts(since);
      if (posts.length && posts[0].username) userName = b(posts[0].username);
      // Не запрашиваем историю эпизодов ради уже оплаченных или коротких постов.
      var candidates = posts.filter(function (p) {
        return !history.used.has(Number(p.id)) && charCount(p.message) >= CFG.minChars;
      });
      var context = await topicContext(candidates, fast);
      newResult(posts, context, history);
      progressDone();
    } catch (error) {
      progressFailed();
      show('Расчёт не выполнен: ' + error.message, 'error');
      $('#ssbc-actions').hidden = true;
    } finally { btn.disabled = false; }
  }

  $('#ssbc-period').addEventListener('change', function () {
    $('#ssbc-custom').hidden = this.value !== 'custom';
    progressReset();
  });
  $('#ssbc-scan').addEventListener('click', calculate);
  $('#ssbc-copy').addEventListener('click', function () {
    buildBBCode();
    copy(state.raw).then(function () { show('BBCode со старыми заявками и новыми постами скопирован.', 'ok'); })
      .catch(function (e) { show(e.message, 'error'); });
  });
  $('#ssbc-insert').addEventListener('click', function () {
    buildBBCode();
    var area = document.querySelector('#main-reply');
    if (!area) {
      copy(state.raw).then(function () { show('Поле ответа не найдено: заявка скопирована.', 'ok'); })
        .catch(function (e) { show(e.message, 'error'); });
      return;
    }
    area.value = (area.value.trim() ? area.value + '\n\n' : '') + state.raw;
    area.dispatchEvent(new Event('input', {bubbles: true}));
    area.focus();
    show('Заявка вставлена в ответ тестовой темы №1364. Проверь сумму и при необходимости сохрани сообщение.', 'ok');
    area.scrollIntoView({behavior: 'smooth', block: 'center'});
  });
  $('#ssbc-target').value = currentAdminId > 1 ? String(currentAdminId) : '';
  $('#ssbc-balance').value = initialBalance();
  $('#ssbc-target').addEventListener('input', function () {
    $('#ssbc-balance').value = Number(this.value) === currentAdminId ? initialBalance() : '';
    state.full = false;
    state.priorClaims = [];
    $('#ssbc-actions').hidden = true;
    $('#ssbc-result').innerHTML = '';
    progressReset();
    show('Выберите игрока и период', 'idle');
  });
  $('#ssbc-balance').addEventListener('input', buildBBCode);
  if (!userId || userId <= 1) {
    $('#ssbc-scan').disabled = true;
    show('Для использования скрытого сборщика требуется войти под администратором.', 'error');
  }
  } // mountBank
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountBank, {once:true});
  } else {
    mountBank();
  }
})();
