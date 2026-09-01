(function () {
  'use strict';

  var ICONS = {
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    infinity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-6.687-8-11.784-8-5.096 0-5.096 8 0 8 5.097 0 6.688-8 11.784-8z"></path></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 1-1h13.5a.5.5 0 0 1 .4.8l-3.3 4.3a.5.5 0 0 0 0 .6l3.3 4.3a.5.5 0 0 1-.4.8H5"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>'
  };

  var VALUES = [
    { icon: 'layers', title: 'Na ordem que funcionou pra mim', text: 'Tentei pular pra Kubernetes duas vezes sem fundamentos e voltei pra estaca zero as duas. Essa ordem é a que finalmente colou.' },
    { icon: 'target', title: 'Só o que eu de fato usei', text: 'Cada tópico aqui é coisa que eu realmente precisei no dia a dia — nada de encher a trilha só pra parecer mais completa.' },
    { icon: 'briefcase', title: 'Com os tropeços incluídos', text: 'Cada guia tem os erros que eu cometi de verdade — não só o caminho certo, mas onde eu escorreguei.' }
  ];

  var STORAGE_KEY = 'devops-roadmap-progress';
  var state = {};
  var STAGES = [];
  var openStage = null;

  function itemId(sId, i) { return sId + ':' + i; }

  function loadProgress() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      state = raw ? JSON.parse(raw) : {};
    } catch (e) {
      state = {};
    }
  }
  function saveProgress() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.error('Não foi possível salvar o progresso:', e); }
  }

  function stageStats(stage) {
    var total = stage.items.length, done = 0, hoursDone = 0, hoursTotal = 0;
    stage.items.forEach(function (it, i) {
      hoursTotal += it.hours;
      if (state[itemId(stage.id, i)]) { done++; hoursDone += it.hours; }
    });
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0, hoursLeft: hoursTotal - hoursDone, hoursTotal: hoursTotal };
  }

  function overallStats() {
    var done = 0, total = 0, hoursLeft = 0, stagesDone = 0;
    STAGES.forEach(function (s) {
      var r = stageStats(s);
      done += r.done; total += r.total; hoursLeft += r.hoursLeft;
      if (r.pct === 100) stagesDone++;
    });
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0, hoursLeft: hoursLeft, stagesDone: stagesDone, stagesTotal: STAGES.length };
  }

  function findNext() {
    for (var s = 0; s < STAGES.length; s++) {
      var stage = STAGES[s];
      for (var i = 0; i < stage.items.length; i++) {
        if (!state[itemId(stage.id, i)]) return { stage: stage, idx: i };
      }
    }
    return null;
  }

  function toggleItem(sId, i) { state[itemId(sId, i)] = !state[itemId(sId, i)]; saveProgress(); render(); }
  function toggleStage(sId) { openStage = openStage === sId ? null : sId; render(); }
  function resetAll() {
    if (!window.confirm('Tem certeza que deseja reiniciar o seu progresso?')) return;
    state = {};
    saveProgress();
    render();
  }

  function ringSvg(size, stroke, pct, color) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r, offset = c - (pct / 100) * c;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--surface-2)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + offset + '" style="transition: stroke-dashoffset .4s ease;"/>' +
      '</svg>';
  }

  function valueCard(v) {
    return '<div class="rd-value-card rd-reveal">' +
      '<div class="rd-value-icon">' + ICONS[v.icon] + '</div>' +
      '<h3 class="rd-value-title">' + v.title + '</h3>' +
      '<p class="rd-value-text">' + v.text + '</p>' +
      '</div>';
  }

  function stageCard(stage, idx) {
    var r = stageStats(stage);
    var isOpen = openStage === stage.id;
    var nodeIcon = r.pct === 100 ? ICONS.check : ICONS[stage.icon];
    var num = String(idx + 1).padStart(2, '0');
    var itemsHtml = stage.items.map(function (it, i) {
      var checked = !!state[itemId(stage.id, i)];
      return '<div class="rd-item ' + (checked ? 'rd-checked' : '') + '" data-stage="' + stage.id + '" data-idx="' + i + '" data-action="toggle-item">' +
        '<span class="rd-checkbox" style="' + (checked ? 'background:' + stage.color + ';border-color:' + stage.color + ';' : '') + '">' + ICONS.check + '</span>' +
        '<span class="rd-item-body"><span class="rd-item-text">' + it.text + '</span><span class="rd-item-hours">' + it.hours + 'h</span></span>' +
        '</div>';
    }).join('');
    return '<div class="rd-stage-card rd-reveal ' + (isOpen ? 'rd-open' : '') + '" style="--stage-color:' + stage.color + '">' +
      '<span class="rd-stage-bignum">' + num + '</span>' +
      '<button class="rd-stage-head" data-stage="' + stage.id + '" data-action="toggle-stage">' +
      '<span class="rd-stage-icon">' + nodeIcon + '</span>' +
      '<div class="rd-stage-titles"><p class="rd-stage-name">' + stage.name + '</p><p class="rd-stage-tagline">' + stage.tagline + '</p></div>' +
      '<div class="rd-stage-meta"><span class="rd-stage-count">' + r.done + '/' + r.total + '</span><span class="rd-stage-hours">' + (r.hoursLeft > 0 ? r.hoursLeft + 'h restantes' : 'concluído') + '</span></div>' +
      '<span class="rd-chevron">' + ICONS.chevron + '</span>' +
      '</button>' +
      '<div class="rd-mini-track"><div class="rd-mini-fill" style="width:' + r.pct + '%;background:' + stage.color + ';"></div></div>' +
      (isOpen ? '<div class="rd-stage-body">' + itemsHtml + '</div>' : '') +
      '</div>';
  }

  var root = document.getElementById('rd-root');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('rd-visible'); });
  }, { threshold: 0.1 });

  function render() {
    var overall = overallStats();
    var next = findNext();
    var totalHours = STAGES.reduce(function (a, s) { return a + s.items.reduce(function (x, i) { return x + i.hours; }, 0); }, 0);

    var nextHtml = next ?
      '<div class="rd-next" data-action="go-next">' +
      '<span class="rd-next-icon">' + ICONS.flag + '</span>' +
      '<div class="rd-next-copy"><p class="rd-next-label">Continuar de onde parou</p><p class="rd-next-text">' + next.stage.name + ' — ' + next.stage.items[next.idx].text + '</p></div>' +
      '<span class="rd-next-arrow">' + ICONS.arrow + '</span>' +
      '</div>' :
      '<div class="rd-next rd-done">' +
      '<span class="rd-next-icon" style="color:var(--accent)">' + ICONS.check + '</span>' +
      '<div class="rd-next-copy"><p class="rd-next-label">Trilha concluída</p><p class="rd-next-text">Você estudou todos os tópicos do roadmap.</p></div>' +
      '</div>';

    var completeBanner = overall.pct === 100 ?
      '<div class="rd-complete-banner"><p>Parabéns, você concluiu a trilha DevOps.<span>Todos os ' + overall.total + ' tópicos foram estudados. Hora de aplicar isso em um projeto real.</span></p></div>' : '';

    Array.prototype.forEach.call(root.querySelectorAll(':scope > *:not(.rd-bg)'), function (n) { n.remove(); });

    root.insertAdjacentHTML('beforeend',
      '<nav class="rd-nav">' +
      '<div class="rd-logo"><span class="rd-logo-dot"></span>roadmap-devops</div>' +
      '<div class="rd-nav-right">' +
      '<a class="rd-nav-link" href="#rd-why">Por que esta trilha</a>' +
      '<a class="rd-nav-link" href="#rd-roadmap">Etapas</a>' +
      '<a class="rd-nav-link" href="https://github.com/Isac-Andrade/DevOps-Roadmap" target="_blank" rel="noopener">GitHub</a>' +
      '<button class="rd-nav-cta" data-action="go-next">Continuar estudando</button>' +
      '</div>' +
      '</nav>' +

      '<section class="rd-hero"><div class="rd-inner">' +
      '<span class="rd-eyebrow">Minhas anotações de estudo · abertas pra qualquer um usar</span>' +
      '<h1 class="rd-h1">O roadmap que eu queria ter encontrado quando comecei em <span class="rd-grad">DevOps</span></h1>' +
      '<p class="rd-lede">7 etapas, dos fundamentos de Linux à segurança em produção — na ordem que fez sentido pra mim, depois de tentar (e errar) o caminho mais curto duas vezes.</p>' +
      '<div class="rd-ctas">' +
      '<button class="rd-btn rd-btn-primary" data-action="go-next">' + (overall.done > 0 ? 'Continuar minha trilha' : 'Começar agora') + '</button>' +
      '<a class="rd-btn rd-btn-ghost" href="#rd-why">Por que esta trilha</a>' +
      '</div>' +
      '<div class="rd-preview">' +
      '<div class="rd-preview-top"><span class="rd-preview-label">Sua trilha</span><span class="rd-live-dot"><span></span>salvo neste navegador</span></div>' +
      '<div class="rd-preview-body">' +
      '<div class="rd-ring-wrap">' + ringSvg(78, 6, overall.pct, '#34D1A0') + '<div class="rd-ring-pct"><span class="rd-ring-num">' + overall.pct + '%</span></div></div>' +
      '<div class="rd-preview-stats">' +
      '<div class="rd-preview-stat"><span class="rd-preview-stat-label">Tópicos estudados</span><span class="rd-preview-stat-val">' + overall.done + '/' + overall.total + '</span></div>' +
      '<div class="rd-preview-stat"><span class="rd-preview-stat-label">Etapas concluídas</span><span class="rd-preview-stat-val">' + overall.stagesDone + '/' + overall.stagesTotal + '</span></div>' +
      '<div class="rd-preview-stat"><span class="rd-preview-stat-label">Estudo restante</span><span class="rd-preview-stat-val">' + overall.hoursLeft + 'h</span></div>' +
      '</div>' +
      '</div>' +
      '<div class="rd-preview-next">' + (next ? 'Próximo tópico: <b>' + next.stage.items[next.idx].text + '</b>' : 'Todos os tópicos concluídos.') + '</div>' +
      '</div>' +
      '<div class="rd-stats-row">' +
      '<div><div class="rd-stat-num">' + STAGES.length + '</div><div class="rd-stat-label">etapas</div></div>' +
      '<div><div class="rd-stat-num">' + overall.total + '</div><div class="rd-stat-label">tópicos</div></div>' +
      '<div><div class="rd-stat-num">~' + totalHours + 'h</div><div class="rd-stat-label">de estudo</div></div>' +
      '</div>' +
      '</div></section>' +

      '<section id="rd-why"><div class="rd-inner">' +
      '<div class="rd-section-head"><p class="rd-section-eyebrow">Organizado conforme o padrão que utilizei para estudar</p><h2 class="rd-h2">O caminho que eu queria ter seguido desde o início</h2><p class="rd-section-sub">Sem atalho — foi tentando encurtar que eu mais perdi tempo.</p></div>' +
      '<div class="rd-values">' + VALUES.map(valueCard).join('') + '</div>' +
      '</div></section>' +

      '<section id="rd-roadmap"><div class="rd-inner">' +
      '<div class="rd-section-head"><p class="rd-section-eyebrow">O caminho</p><h2 class="rd-h2">As 7 etapas da trilha</h2><p class="rd-section-sub">Clique em uma etapa para ver e marcar os tópicos. Leia a documentação completa de cada uma na pasta <code>/docs</code> do repositório.</p></div>' +
      completeBanner +
      nextHtml +
      '<div class="rd-roadmap-list">' + STAGES.map(stageCard).join('') + '</div>' +
      '</div></section>' +

      '<footer class="rd-footer">' +
      '<span class="rd-sync rd-live"><span class="rd-sync-dot"></span>progresso salvo automaticamente neste navegador</span>' +
      '<div class="rd-footer-links">' +
      '<button class="rd-reset" data-action="reset">Reiniciar progresso</button>' +
      '</div>' +
      '</footer>'
    );

    root.querySelectorAll('[data-action="toggle-item"]').forEach(function (n) {
      n.addEventListener('click', function () { toggleItem(n.getAttribute('data-stage'), parseInt(n.getAttribute('data-idx'), 10)); });
    });
    root.querySelectorAll('[data-action="toggle-stage"]').forEach(function (n) {
      n.addEventListener('click', function () { toggleStage(n.getAttribute('data-stage')); });
    });
    root.querySelectorAll('[data-action="go-next"]').forEach(function (n) {
      n.addEventListener('click', function () {
        if (!next) return;
        openStage = next.stage.id;
        render();
        var card = root.querySelector('[data-stage="' + next.stage.id + '"]');
        if (card) card.closest('.rd-stage-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    var resetBtn = root.querySelector('[data-action="reset"]');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    root.querySelectorAll('.rd-reveal').forEach(function (el) { io.observe(el); });
  }

  function renderLoading() {
    root.insertAdjacentHTML('beforeend', '<div class="rd-loading">carregando trilha…</div>');
  }
  function renderError() {
    Array.prototype.forEach.call(root.querySelectorAll(':scope > *:not(.rd-bg)'), function (n) { n.remove(); });
    root.insertAdjacentHTML('beforeend', '<div class="rd-loading">Não foi possível carregar os dados do roadmap (data/roadmap.json).</div>');
  }

  renderLoading();
  loadProgress();

  fetch('./data/roadmap.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      STAGES = (data.stages || []).slice().sort(function (a, b) { return a.order - b.order; });
      render();
    })
    .catch(function (err) {
      console.error('Erro ao carregar roadmap.json:', err);
      renderError();
    });
})();
