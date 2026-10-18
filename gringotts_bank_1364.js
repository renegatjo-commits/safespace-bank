// Safe Space / Gringotts — внешний файл для HTML-низа
// Встроенный интерфейс доступен только администратору в теме /viewtopic.php?id=1364.

/* Safe Space / Gringotts: закрытый сборщик заявок v2.1 (без общего лимита 1100 сообщений).
 * Показывается только на safespace.rusff.me/viewtopic.php?id=1364,
 * только авторизованным администраторам форума (GroupID===1).
 * Использует тарифы по действующим правилам банка, а историю заявок
 * читает из тем 20 (старый открытый банк), 401 (бывший кабинет) и 1364 (тест).
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
    bankStyle.textContent = "/* Дизайн согласован с темой банка Гринготтс */\n\n.ssbc-wrap { box-sizing: border-box; width: 94%; max-width: 900px; margin: 24px auto;\n  background: #f4f0e8; border: 1px solid #d8d0c5; border-radius: 12px;\n  padding: 19px; font-family: Arial, sans-serif; color: #403a43; }\n.ssbc-wrap .ssbc-headline { font-family: Georgia, serif; font-weight: normal; text-align:center; font-size: 19px; color: #4b3b59; margin: 0 0 6px; }\n.ssbc-wrap .ssbc-intro { color: #766f77; font-size: 12px; line-height: 1.65; text-align: center; margin: 0 0 17px; }\n.ssbc-wrap .ssbc-fields { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; margin-bottom: 14px; }\n.ssbc-wrap .ssbc-fields label { flex: 1 1 175px; display:flex; flex-direction:column; gap:6px; font-size:12px; color:#51415e; }\n.ssbc-wrap .ssbc-fields select, .ssbc-wrap .ssbc-fields input { font: 13px Arial, sans-serif; color:#403a43; border-radius:8px; border:1px solid #cbc0d1; box-sizing:border-box; padding:9px; width:100%; background:#fff; }\n.ssbc-wrap .ssbc-check { display:block; font-size:12px; color:#625a66; line-height:1.5; margin:10px 0 15px; }\n.ssbc-wrap .ssbc-check input, .ssbc-wrap .ssbc-confirm input, .ssbc-wrap .ssbc-row input { vertical-align:middle; accent-color:#695485; }\n.ssbc-wrap .ssbc-button { display:inline-block; border:0; border-radius:8px; padding:11px 17px; font: 12px Arial, sans-serif; cursor:pointer; background:#5f4c75; color:#fff; transition: .2s; }\n.ssbc-wrap .ssbc-button:hover { background: #48345e; }\n.ssbc-wrap .ssbc-button:disabled { opacity:.48; cursor:default; }\n.ssbc-wrap .ssbc-button-light { background:#e4dce9; color:#45394f; }\n.ssbc-wrap .ssbc-button-light:hover { background:#d4c5dd; }\n.ssbc-wrap .ssbc-status { margin:14px 0; border-left:3px solid #a98e61; padding:10px 12px; background:#ece8e2; font-size:12px; line-height:1.5; }\n.ssbc-wrap .ssbc-status.ok { border-color:#678269; background:#e3e9e1; }\n.ssbc-wrap .ssbc-status.error, .ssbc-wrap .ssbc-alert { border-color:#ad665f; background:#f3e4e0; }\n.ssbc-wrap .ssbc-summary { background:#e6ddeb; border-radius:9px; padding:14px; line-height:1.75; text-align:center; margin-top:16px; font-size:13px; color:#453354; }\n.ssbc-wrap .ssbc-small { font-size:11px; line-height:1.5; color:#756e79; }\n.ssbc-wrap .ssbc-alert { border-left:3px solid #ad665f; padding:12px; margin:12px 0; font-size:11px; line-height:1.7; border-radius:4px; }\n.ssbc-wrap .ssbc-alert details { margin-top:6px; max-height:180px; overflow:auto; }\n.ssbc-wrap .ssbc-alert summary { cursor:pointer; }\n.ssbc-wrap .ssbc-rows { max-height:360px; overflow:auto; margin:10px 0 15px; }\n.ssbc-wrap .ssbc-row { display:flex; align-items:center; justify-content:space-between; gap:10px; border-bottom:1px solid #ded6ce; padding:9px 4px; font-size:12px; }\n.ssbc-wrap .ssbc-row label { min-width:0; line-height:1.5; }\n.ssbc-wrap .ssbc-row small { color:#817886; font-size:10px; }\n.ssbc-wrap .ssbc-row b { white-space:nowrap; color:#5a466b; }\n.ssbc-wrap .ssbc-confirm { display:block; padding:12px; font-size:12px; line-height:1.5; background:#f3e4e0; border-radius:8px; margin:8px 0 15px; }\n.ssbc-wrap .ssbc-actions { display:flex; gap:9px; align-items:center; flex-wrap:wrap; margin:12px 0; }\n.ssbc-wrap .ssbc-actions[hidden], .ssbc-wrap #ssbc-custom[hidden] { display:none!important; }\n.ssbc-wrap #ssbc-text { width:100%; min-height:175px; resize:vertical; box-sizing:border-box; border:1px solid #cbc0d1; padding:12px; border-radius:8px; font:12px/1.5 Consolas,monospace; color:#3b3440; background:white; }\n@media(max-width:650px){.ssbc-wrap {width:100%;padding:12px;} .ssbc-wrap .ssbc-headline{font-size:16px;} .ssbc-wrap .ssbc-row{flex-wrap:wrap;} .ssbc-wrap .ssbc-fields{gap:9px;} .ssbc-wrap .ssbc-button{padding:10px 11px;} }";
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
        <h3 class="ssbc-headline">Гринготтс · закрытый сборщик АМС</h3>
        <p class="ssbc-intro">Проверка постов выбранного игрока и заявок из банка №20, бывшего кабинета №401 и тестовой темы №1364. Готовим BBCode для проверки АМС. Ничего не начисляется автоматически.</p>
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
        <label class="ssbc-check"><input id="ssbc-fast" type="checkbox" checked> Добавлять +10 за ответ в течение суток только в личных эпизодах и альтернативе (включая архивы)</label>
        <button type="button" id="ssbc-scan" class="ssbc-button">Проверить историю и собрать посты</button>
        <div id="ssbc-status" class="ssbc-status">Выберите игрока и период. История сверяется по трём темам (№20, №401 и №1364).</div>
        <div id="ssbc-result"></div>
        <div id="ssbc-actions" hidden>
          <div class="ssbc-actions">
            <b id="ssbc-selected-total">К начислению: 0</b>
            <button type="button" id="ssbc-copy" class="ssbc-button ssbc-button-light">Скопировать BBCode</button>
            <button type="button" id="ssbc-insert" class="ssbc-button">Вставить в ответ темы №1364</button>
          </div>
          <textarea id="ssbc-text" readonly aria-label="Текст банковской заявки"></textarea>
          <p class="ssbc-small">Публичная тема №20 остаётся нетронутой. Для проверки новые тестовые подтверждения можно хранить в теме №1364: следующие расчёты проверят все три темы. Старые выплаты без отдельных ссылок требуют ручной сверки. Бонус за 50 постов и другие награды считаются отдельно.</p>
        </div>`;
  if (firstPost) firstPost.insertAdjacentElement('beforebegin', root);
  else mountPoint.insertAdjacentElement('afterbegin', root);

  var CFG = {
    bankTopics: [20, 401, 1364], // 20: прежний банк; 401: прошлый кабинет; 1364: тестовые заявки
    minChars: 1000,
    gameForums: {5: 30, 8: 30, 9: 10, 17: 30, 18: 30, 19: 10},
    fastForums: new Set([8, 9, 18, 19]), // личные, альтернатива и их архивы; НЕ сюжетные (5, 17)
    fastBonus: 10,
    pageSize: 100,
    maxSkip: 1000, // предел одного обхода post.get; после него включается поиск по игровым темам
    groupedPageSize: 200,
    groupedMaxSkip: 2000, // ограничение API для group_by=topic_id
    topicPageSize: 100,
    topicMaxSkip: 10000, // актуальный предел topic.get; для сверхбольших форумов сообщаем об ошибке
    maxBankPages: 350,
    delayMs: 85
  };
  var $ = function (selector) { return root.querySelector(selector); };
  var currentAdminId = Number(window.UserID || 0);
  var userId = currentAdminId; // меняется по выбранному ID профиля при расчёте
  var userName = String(window.UserLogin || '');
  var state = { rows: [], used: new Map(), suspicious: [], full: false, raw: '', historyCount: 0 };
  var b = function (s) { return String(s == null ? '' : s); };
  var sleep = function (n) { return new Promise(function (done) { setTimeout(done, n); }); };
  var link = function (pid) { return '/viewtopic.php?pid=' + pid + '#p' + pid; };
  var show = function (message, kind) {
    var box = $('#ssbc-status');
    box.textContent = message;
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

  // Из URL с разными схемами Rusff извлекаем ОДИН ID сообщения.
  // Ссылки на другие сайты не считаются доказательствами.
  function postIdFromLink(href) {
    try {
      var u = new URL(href, location.origin);
      if (u.hostname.replace(/^www\./, '') !== location.hostname.replace(/^www\./, '')) return null;
      if (!/\/(?:viewtopic\.php|post\.php)$/i.test(u.pathname)) return null;
      var pid = u.searchParams.get('pid');
      var hash = u.hash.match(/^#p(\d+)$/i);
      var id = pid && /^\d+$/.test(pid) ? Number(pid) : hash ? Number(hash[1]) : null;
      if (!id || !Number.isSafeInteger(id)) return null;
      if (CFG.bankTopics.includes(Number(u.searchParams.get('id')))) return null;
      return id;
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
    el.querySelectorAll('blockquote, .quote-box, .code-box, code, pre, script, style, .spoiler').forEach(function (x) { x.remove(); });
    var ids = new Set();
    el.querySelectorAll('a[href]').forEach(function (a) {
      var id = postIdFromLink(a.getAttribute('href'));
      if (id) ids.add(id);
    });
    // Также поддерживаем URL, написанные простым текстом или в [url=...].
    var raw = el.innerHTML + '\n' + el.textContent;
    var matches = raw.match(/(?:https?:\/\/safespace\.rusff\.me)?\/?viewtopic\.php\?[^\s"'<>\[\]]+/gi) || [];
    matches.forEach(function (m) {
      var clean = m.replace(/&amp;/g, '&').replace(/[),.;]+$/, '');
      var id = postIdFromLink(clean);
      if (id) ids.add(id);
    });
    var text = el.textContent.replace(/\s+/g, ' ');
    // Старые заявки с количеством постов, но без ссылок, НЕ МОЖЕМ безопасно сопоставить с ID.
    var uncertain = !ids.size && /(?:пост(?:ы|ов|а|ам|ами)?|альт(?:ернатив|ы)?|быстр(?:ый|ые|ого)\s+ответ|постописец)/i.test(text)
      && /(?:за что|сколько|зачисл|начисл|\+\s*\d|итогов|галлеон|\d+\s*(?:пост|шт))/i.test(text);
    return { ids: ids, uncertain: uncertain };
  }

  async function bankTopicInfo(topicId) {
    var data = array(await api('topic.get', {
      topic_id: topicId, fields: 'id,forum_id,num_replies,init_post,first_post', limit: 1
    }));
    if (!data.length) throw new Error('Тема №' + topicId + ' не найдена через API. Для скрытой темы требуются права доступа АМС.');
    return data[0];
  }

  // Тщательно проверяем историю КАЖДОЙ темы — не допускаем частичного сканирования.
  async function bankHistoryOne(topicId) {
    var topic = await bankTopicInfo(topicId);
    var expected = Number(topic.num_replies) + 1;
    if (!Number.isSafeInteger(expected) || expected < 1)
      throw new Error('Не удалось определить количество сообщений темы №' + topicId);
    var bankRows = [];
    if (expected <= CFG.maxSkip + CFG.pageSize) {
      for (var skip = 0; skip < expected; skip += CFG.pageSize) {
        show('Тема №' + topicId + ': проверяю ' + Math.min(skip + CFG.pageSize, expected) + ' из ' + expected + ' сообщений…');
        var page = array(await api('post.get', {
          topic_id: topicId, fields: 'id,user_id,username,message,posted,topic_id',
          sort_by: 'posted', sort_dir: 'asc', skip: skip, limit: CFG.pageSize
        }));
        bankRows.push.apply(bankRows, page);
        if (!page.length) break;
        await sleep(CFG.delayMs);
      }
      if (new Set(bankRows.map(function (p) { return Number(p.id); })).size !== expected)
        bankRows = await bankHistoryFromPages(expected, topicId);
    } else {
      bankRows = await bankHistoryFromPages(expected, topicId);
    }
    if (new Set(bankRows.map(function (p) { return Number(p.id); })).size !== expected)
      throw new Error('Не удалось прочесть ВСЮ историю темы №' + topicId + ' (' + bankRows.length + ' из ' + expected + '). Расчёт остановлен.');

    var firstId = Number(topic.init_post) || Number(topic.first_post) ||
      Math.min.apply(null, bankRows.map(function (r) { return Number(r.id); }));
    var used = new Map();
    var uncertain = [];
    bankRows.forEach(function (post) {
      if (Number(post.id) === firstId) return; // первый пост: правила/содержимое темы
      // В старом банке №20 все сообщения после первого считаем потенциальными заявками.
      // В служебных темах №401 и №1364 игнорируем сообщения без признаков заявок:
      // там могли быть другие материалы, не относящиеся к оплате.
      if (topicId !== 20 && !/(?:за\s+что|сколько|итогов\w*\s+сумм\w*|к\s+начислению)\s*:/i.test(plainText(post.message))) return;
      var data = claimData(post.message);
      data.ids.forEach(function (id) {
        if (!used.has(id)) used.set(id, {bankPostId: Number(post.id), topicId: topicId, author: b(post.username)});
      });
      if (data.uncertain) uncertain.push({id: Number(post.id), topicId: topicId,
        userId: Number(post.user_id), author: b(post.username)});
    });
    return {used: used, suspicious: uncertain, historyCount: bankRows.length - 1};
  }

  async function bankHistory() {
    var used = new Map();
    var suspicious = [];
    var historyCount = 0;
    for (var topicId of CFG.bankTopics) {
      var h = await bankHistoryOne(topicId);
      h.used.forEach(function (value, key) { if (!used.has(key)) used.set(key, value); });
      suspicious.push.apply(suspicious, h.suspicious);
      historyCount += h.historyCount;
    }
    return {used: used, suspicious: suspicious, historyCount: historyCount};
  }

  // При достижении лимита skip=1000 переключаемся на полный обход страниц.
  async function bankHistoryFromPages(expected, topicId) {
    var all = new Map();
    var stagnant = 0;
    for (var p = 1; p <= CFG.maxBankPages; p++) {
      show('Тема №' + topicId + ': страница ' + p + ', прочитано ' + all.size + ' из ' + expected + '…');
      var resp = await fetch('/viewtopic.php?id=' + topicId + '&p=' + p,
        {credentials: 'same-origin', cache: 'no-store'});
      if (!resp.ok) break;
      var html = await resp.text();
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var nodes = doc.querySelectorAll('.post[id]');
      var before = all.size;
      nodes.forEach(function (post) {
        var idm = (post.id || '').match(/(?:^p|post)(\d+)$/i);
        if (!idm) return;
        var content = post.querySelector('.post-content') || post.querySelector('.post-body');
        if (!content) return;
        var userId = Number(post.getAttribute('data-user-id')) || 0;
        var uname = post.querySelector('.pa-author a');
        all.set(Number(idm[1]), {id: Number(idm[1]), message: content.innerHTML,
          user_id: userId, username: uname ? uname.textContent : ''});
      });
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
  // ВСЕХ тем шести игровых разделов (а не пропускаем часть сообщений).
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
      if (reachedStart || posts.length < CFG.pageSize) return result;
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
    for (var t of topics) {
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
      var canFast = fastEnabled && target.some(function (p) {
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
          if (!CFG.fastForums.has(Number(post.forum_id))) return;
          var pos = index.get(Number(post.id));
          if (pos == null || pos < 1) return;
          var prev = all[pos - 1];
          var diff = Number(post.posted) - Number(prev.posted);
          if (Number(prev.user_id) !== userId && diff >= 0 && diff <= 86400) quick.add(Number(post.id));
        });
      }
      await sleep(CFG.delayMs);
    }
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
      var base = CFG.gameForums[Number(p.forum_id)];
      var fast = CFG.fastForums.has(Number(p.forum_id)) && ctx.quick.has(id) ? CFG.fastBonus : 0;
      newRows.push({id: id, posted: p.posted, length: len, forum: Number(p.forum_id), base: base,
        fast: fast, sum: base + fast});
    });
    newRows.sort(function (a, z) { return Number(a.posted) - Number(z.posted); });
    state.rows = newRows;
    state.used = history.used;
    state.suspicious = history.suspicious;
    state.historyCount = history.historyCount;
    state.full = true;
    var total = newRows.reduce(function (acc, p) { return acc + p.sum; }, 0);
    var name = escapeHtml(userName);
    var html = '<div class="ssbc-summary"><b>' + newRows.length + '</b> новых · <b>' + usedRows.length +
      '</b> уже заявлены · <b>' + tooShort.length + '</b> короче 1000 символов<br><b>Итого: +' + money(total) + ' галлеонов</b></div>';
    html += '<p class="ssbc-small">Проверено ' + history.historyCount + ' сообщений в трёх банковских темах. Посты из заявок любого игрока исключены по ID.</p>';
    if (usedRows.length) {
      html += '<details class="ssbc-small"><summary style="cursor:pointer">Показать уже заявленные посты (' +
        usedRows.length + ')</summary><div style="padding:7px 10px">' +
        usedRows.map(function (post) {
          var info = history.used.get(Number(post.id));
          return '<a target="_blank" rel="noopener" href="' + link(post.id) + '">Пост #' + post.id + '</a>' +
            (info ? ' — <a target="_blank" rel="noopener" href="' + link(info.bankPostId) +
              '">заявлен в теме №' + info.topicId + '</a>' : ' — уже заявлен');
        }).join('<br>') + '</div></details>';
    }
    var relevant = history.suspicious.filter(function (p) { return !p.userId || p.userId === userId; });
    if (history.suspicious.length) {
      html += '<div class="ssbc-alert"><b>Ручная сверка:</b> найдены ' + history.suspicious.length +
        ' старых банковских сообщений с упоминанием постов, но без отдельных ссылок. ' +
        (relevant.length ? ('Из них ' + relevant.length + ' от текущего профиля или с неизвестным автором. ') : '') +
        'По ним невозможно определить уже оплаченные ID автоматически. ' +
        '<details><summary>Посмотреть подозрительные заявки</summary>' +
        history.suspicious.slice(0, 80).map(function (p) {
          return '<a target="_blank" rel="noopener" href="' + link(p.id) + '">Заявка #' + p.id +
            '</a> (' + escapeHtml(p.author || 'автор не определён') + ')';
        }).join('<br>') + '</details></div>';
    }
    if (ctx.needsReview.length) {
      html += '<div class="ssbc-alert">' + ctx.needsReview.map(escapeHtml).join('<br>') + '</div>';
    }
    html += '<div class="ssbc-rows">';
    newRows.forEach(function (p) {
      html += '<div class="ssbc-row"><label><input type="checkbox" data-post="' + p.id + '" checked>' +
        ' <a href="' + link(p.id) + '" target="_blank" rel="noopener">Пост #' + p.id + '</a>' +
        ' <small>' + dateOf(p.posted) + ' · ' + p.length + ' симв. · ' + ([9, 19].includes(p.forum) ? 'Альтернатива' : 'Игра') +
        (p.fast ? ' · быстрый ответ' : '') + '</small></label><b>+' + p.sum + '</b></div>';
    });
    if (!newRows.length) html += '<p>Новых подходящих постов за этот период нет.</p>';
    html += '</div>';
    if (history.suspicious.length) {
      html += '<label class="ssbc-confirm"><input type="checkbox" id="ssbc-reviewed"> Я проверил(а) старые заявки без ссылок и убедился(ась), что новые посты не были оплачены ранее</label>';
    }
    $('#ssbc-result').innerHTML = html;
    $('#ssbc-actions').hidden = false;
    buildBBCode();
    $('#ssbc-result').querySelectorAll('input[type="checkbox"]').forEach(function (input) {
      input.addEventListener('change', buildBBCode);
    });
    show('Проверка трёх тем завершена. Отметь подходящие посты и скопируй заявку.', 'ok');
  }

  function buildBBCode() {
    if (!state.full) return '';
    var checked = Array.from($('#ssbc-result').querySelectorAll('input[data-post]:checked'))
      .map(function (x) { return Number(x.dataset.post); });
    var selected = state.rows.filter(function (r) { return checked.includes(r.id); });
    var game = selected.filter(function (r) { return ![9, 19].includes(r.forum); });
    var alt = selected.filter(function (r) { return [9, 19].includes(r.forum); });
    var fast = selected.filter(function (r) { return r.fast; });
    var total = selected.reduce(function (n, row) { return n + row.sum; }, 0);
    var lines = ['[b]Профиль:[/b] [url=' + location.origin + '/profile.php?id=' + userId + ']' +
      userName.replace(/[\[\]]/g, '') + '[/url] (ID ' + userId + ')',
      '[b]За что:[/b] Игровые посты (проверенный расчёт)'];
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
    state.raw = lines.join('\n');
    $('#ssbc-text').value = state.raw;
    $('#ssbc-selected-total').textContent = 'К начислению: +' + money(total);
    var confirm = $('#ssbc-reviewed');
    var blocked = !!confirm && !confirm.checked;
    $('#ssbc-copy').disabled = blocked || !selected.length;
    $('#ssbc-insert').disabled = blocked || !selected.length;
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
    $('#ssbc-actions').hidden = true;
    $('#ssbc-result').innerHTML = '';
    try {
      var since = selectedDate();
      var fast = $('#ssbc-fast').checked;
      show('Сверяю старые и новые заявки в темах №20, №401 и №1364…');
      var history = await bankHistory();
      var posts = await userPosts(since);
      if (posts.length && posts[0].username) userName = b(posts[0].username);
      // Не запрашиваем историю эпизодов ради уже оплаченных или коротких постов.
      var candidates = posts.filter(function (p) {
        return !history.used.has(Number(p.id)) && charCount(p.message) >= CFG.minChars;
      });
      var context = await topicContext(candidates, fast);
      newResult(posts, context, history);
    } catch (error) {
      show('Расчёт не выполнен: ' + error.message, 'error');
      $('#ssbc-actions').hidden = true;
    } finally { btn.disabled = false; }
  }

  $('#ssbc-period').addEventListener('change', function () {
    $('#ssbc-custom').hidden = this.value !== 'custom';
  });
  $('#ssbc-scan').addEventListener('click', calculate);
  $('#ssbc-copy').addEventListener('click', function () {
    buildBBCode();
    copy(state.raw).then(function () { show('BBCode скопирован. Для теста сохраняйте новые заявки в теме №1364, чтобы они учитывались при следующей проверке.', 'ok'); })
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
    $('#ssbc-actions').hidden = true;
    $('#ssbc-result').innerHTML = '';
    show('Профиль изменён. Запусти новую проверку всех трёх тем.');
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
