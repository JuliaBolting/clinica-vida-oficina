/* Interface compartilhada. Nenhuma regra específica dos grupos deve ser implementada aqui. */
window.ClinicApp = (() => {
  const U = ClinicUtils,
    I = (name) => ClinicIcons.get(name),
    E = U.escape;
  const modules = ClinicModules;
  const state = {
    page: "home",
    search: {},
    sort: {},
    pagination: {},
    agendaView: "lista",
    agendaDate: "",
    agendaDoctor: "",
    agendaStatus: "",
    week: U.monday(U.localDate()),
    editing: null,
    editorBaseline: "",
    pendingImport: null,
    theme: "sistema",
  };
  const titles = {
    home: "Clínica Vida",
    inicio: "Visão geral",
    dados: "Dados e preferências",
    ...Object.fromEntries(
      Object.entries(modules).map(([k, m]) => [k, m.title]),
    ),
  };
  const $ = (id) => document.getElementById(id);
  function statusBadge(status) {
    const s =
      modules.agendamentos.statuses[status] ||
      modules.agendamentos.statuses.agendada;
    return `<span class="badge ${s.tone}"><span class="badge-dot"></span>${E(s.label)}</span>`;
  }
  function empty(title, detail, icon = "search", action = "") {
    return `<div class="empty-state"><div class="empty-symbol">${I(icon)}</div><h3>${E(title)}</h3><p>${E(detail)}</p>${action}</div>`;
  }
  function buttonNew(key, label) {
    return `<button class="button primary" data-action="new" data-entity="${key}">${I("plus")}${label || `Nov${modules[key].article} ${modules[key].singular}`}</button>`;
  }
  function themeApply(pref) {
    state.theme = pref;
    const resolved =
      pref === "sistema"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "escuro"
          : "claro"
        : pref;
    document.documentElement.dataset.theme = resolved;
    try {
      localStorage.setItem("clinica_vida_tema", pref);
    } catch (_) {}
    $("theme-toggle").innerHTML = I(resolved === "escuro" ? "sun" : "moon");
    $("theme-toggle").title =
      resolved === "escuro" ? "Ativar tema claro" : "Ativar tema escuro";
    $("theme-toggle").setAttribute("aria-label", $("theme-toggle").title);
    const homeToggle = $("home-theme-toggle");
    if (homeToggle) {
      homeToggle.innerHTML = $("theme-toggle").innerHTML;
      homeToggle.title = $("theme-toggle").title;
      homeToggle.setAttribute("aria-label", homeToggle.title);
    }
  }
  function navigation() {
    const nav = (key, icon, label) =>
      `<button class="nav-item ${state.page === key ? "active" : ""}" data-action="navigate" data-page="${key}" ${state.page === key ? 'aria-current="page"' : ""}>${I(icon)}<span>${label}</span>${key === "agendamentos" ? `<span class="nav-count">${ClinicStore.get(key).filter((a) => U.active(a) && U.future(a)).length}</span>` : ""}</button>`;
    $("navigation").innerHTML =
      nav("inicio", "grid", "Visão geral") +
      nav("agendamentos", "calendar", "Agendamentos") +
      '<p class="nav-label">GESTÃO DA CLÍNICA</p>' +
      [
        "pacientes",
        "medicos",
        "especialidades",
        "salas",
        "convenios",
        "secretarias",
      ]
        .map((k) => nav(k, modules[k].icon, modules[k].title))
        .join("") +
      '<div class="nav-divider"></div>' +
      nav("dados", "settings", "Dados e preferências");
  }
  function navigate(page) {
    const homeSection = ClinicHome.isSection(page) ? page : null;
    if (homeSection || !Object.hasOwn(titles, page)) page = "home";
    state.page = page;
    try {
      history.replaceState(null, "", `#${page}`);
    } catch (_) {}
    closeMenu();
    render();
    if (homeSection) ClinicHome.scrollToSection(homeSection, true);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function closeMenu() {
    $("sidebar").classList.remove("open");
    $("sidebar-overlay").hidden = true;
    $("mobile-menu").setAttribute("aria-expanded", "false");
  }
  function render() {
    const isHome = state.page === "home";
    $("clinic-home").hidden = !isHome;
    $("management-shell").hidden = isHome;
    document.querySelector(".skip-link").href = isHome
      ? "#home-main"
      : "#main-content";
    if (isHome) {
      document.title = "Clínica Vida | Cuidado que acolhe";
      ClinicHome.activate();
      return;
    }
    ClinicHome.deactivate();
    $("main-content").dataset.module = state.page;
    navigation();
    $("page-title").textContent = titles[state.page];
    document.title = `${titles[state.page]} | Clínica Vida`;
    $("main-content").innerHTML =
      state.page === "inicio"
        ? dashboard()
        : state.page === "dados"
          ? settings()
          : entityPage(state.page);
  }
  function dashboard() {
    const db = ClinicStore.snapshot(),
      today = U.localDate(),
      appointments = db.agendamentos.filter(U.active),
      upcoming = appointments
        .filter(U.future)
        .sort((a, b) => U.compare(a.data + a.hora, b.data + b.hora)),
      todays = appointments.filter((a) => a.data === today),
      week = U.monday(today);
    const dayCounts = Array.from({ length: 5 }, (_, i) => ({
      date: U.addDays(week, i),
      count: appointments.filter((a) => a.data === U.addDays(week, i)).length,
    }));
    const max = Math.max(1, ...dayCounts.map((d) => d.count)),
      total = dayCounts.reduce((s, d) => s + d.count, 0);
    const stats = [
      {
        key: "pacientes",
        icon: "users",
        tone: "mint",
        label: "Pacientes cadastrados",
        value: db.pacientes.length,
        sub: "Uma história em cada cadastro",
      },
      {
        key: "medicos",
        icon: "doctor",
        tone: "lavender",
        label: "Médicos na equipe",
        value: db.medicos.length,
        sub: `${db.especialidades.length} especialidades disponíveis`,
      },
      {
        key: "agendamentos",
        icon: "calendar",
        tone: "peach",
        label: "Consultas hoje",
        value: todays.length,
        sub: `${upcoming.length} próximas consultas na agenda`,
      },
      {
        key: "salas",
        icon: "room",
        tone: "yellow",
        label: "Salas de atendimento",
        value: db.salas.length,
        sub: "Espaços para acolher e cuidar",
      },
    ];
    return `<div class="page-heading"><div><span class="eyebrow">SEU DIA, MAIS LEVE</span><h1>Olá, equipe<span class="text-accent">.</span></h1><p>Um panorama da clínica, para você focar em quem importa.</p></div><span class="pill">${I("heart")} Cuidar conecta tudo</span></div>
    <section class="hero-banner"><div class="hero-copy"><span class="hero-tag"><span class="status-dot"></span> BEM-VINDOS À CLÍNICA VIDA</span><h2>Mais organização.<br>Mais tempo para <em>cuidar.</em></h2><p>Pacientes, equipe e agenda em sintonia.<br>O próximo cuidado começa aqui.</p>${buttonNew("agendamentos", "Agendar consulta")}<button class="hero-link" data-action="navigate" data-page="agendamentos">Ver minha agenda ${I("arrow")}</button></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-cross">${I("cross")}</div><div class="floating-note note-top"><span class="mini-check">${I("check")}</span><div><strong>Cuidado em dia</strong><span>Uma rotina bem organizada.</span></div></div><div class="floating-note note-bottom"><span class="mini-calendar">${I("calendar")}</span><div><strong>${upcoming.length} consultas</strong><span>nos próximos atendimentos</span></div><span class="note-arrow">${I("arrowUp")}</span></div><svg class="pulse-wave" viewBox="0 0 400 110"><path d="M0 65h95l17-20 18 42 28-72 28 95 25-45h189"/></svg></div></section>
    <section class="stats-grid" aria-label="Indicadores da clínica">${stats.map((s) => `<button class="stat-card" data-action="navigate" data-page="${s.key}"><div class="stat-top"><span class="stat-icon ${s.tone}">${I(s.icon)}</span><span class="stat-arrow">${I("arrowUp")}</span></div><span class="stat-label">${s.label}</span><strong>${s.value.toString().padStart(2, "0")}</strong><small>${s.sub}</small></button>`).join("")}</section>
    <div class="dashboard-grid"><section class="panel upcoming-panel"><div class="panel-heading"><div><span class="eyebrow">CADA ENCONTRO IMPORTA</span><h2>Próximos atendimentos</h2></div><button class="button text small" data-action="navigate" data-page="agendamentos">Ver todos ${I("arrow")}</button></div><div class="upcoming-list">${
      upcoming.length
        ? upcoming
            .slice(0, 4)
            .map((a, i) => {
              const r = modules.agendamentos.present(a, db);
              return `<button class="upcoming-item" data-action="edit" data-entity="agendamentos" data-id="${E(a.id)}"><span class="date-block"><strong>${U.parseDate(a.data).getDate()}</strong><small>${E(U.date(a.data, { day: undefined, month: "short" }).replace(".", ""))}</small></span><span class="appointment-person"><strong>${E(r.paciente)}</strong><small>${E(r.medico)} <span>·</span> ${E(r.especialidade)}</small></span><span class="appointment-time"><strong>${E(a.hora)}</strong><small>${a.duracao || 30} min</small></span>${statusBadge(a.status)}<span class="row-chevron">${I("chevron")}</span></button>`;
            })
            .join("")
        : empty(
            "Sua agenda está livre",
            "Cadastre uma consulta para começar a organizar os atendimentos.",
            "calendar",
            buttonNew("agendamentos", "Agendar consulta"),
          )
    }</div><div class="panel-bottom"><span class="status-dot"></span> A clínica atende de segunda a sexta, das 08h às 18h.</div></section>
    <section class="panel week-panel"><div class="panel-heading"><div><span class="eyebrow">O RITMO DA SEMANA</span><h2>Agenda em números</h2></div><span class="round-icon">${I("calendar")}</span></div><div class="chart-total"><strong>${total.toString().padStart(2, "0")}</strong><span>consultas nesta semana<br><small>${U.date(week)} — ${U.date(U.addDays(week, 4))}</small></span></div><div class="bar-chart" aria-label="Consultas por dia útil desta semana">${dayCounts.map((d, i) => `<button class="bar-column ${d.date === today ? "today" : ""}" data-action="agenda-day" data-date="${d.date}" aria-label="${E(U.date(d.date))}: ${d.count} consultas"><span class="bar-value">${d.count}</span><span class="bar-track"><span class="bar-fill" style="height:${d.count ? Math.max(12, (d.count / max) * 100) : 3}%"></span></span><span class="bar-label">${["SEG", "TER", "QUA", "QUI", "SEX"][i]}</span></button>`).join("")}</div><p class="chart-caption"><span class="legend-dot"></span> Consultas ativas, incluindo as concluídas</p></section></div>
    <div class="lower-grid"><section><div class="section-line"><h2>O que vamos organizar?</h2><span>Acesso rápido</span></div><div class="quick-grid">${["pacientes", "medicos", "salas"].map((k) => `<button class="quick-card" data-action="new" data-entity="${k}"><span class="quick-icon">${I(modules[k].icon)}</span><span><strong>Nov${modules[k].article} ${modules[k].singular}</strong><small>${k === "pacientes" ? "Acolha um novo paciente" : k === "medicos" ? "Amplie a equipe de cuidado" : "Prepare um novo espaço"}</small></span>${I("plus")}</button>`).join("")}</div></section><section class="activity-section"><div class="section-line"><h2>Últimas atividades</h2><span>Histórico local</span></div><div class="activity-list">${
      db.activity
        .slice(0, 3)
        .map(
          (a) =>
            `<div class="activity-item"><span>${I("check")}</span><div><strong>${E(a.message)}</strong><small>${new Date(a.at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</small></div></div>`,
        )
        .join("") ||
      '<p class="muted">As próximas alterações aparecerão aqui.</p>'
    }</div></section></div>`;
  }
  function filtered(key) {
    const db = ClinicStore.snapshot(),
      m = modules[key],
      q = U.normalize(state.search[key] || "");
    let rows = db[key].map((row) => ({ raw: row, ...m.present(row, db) }));
    if (q)
      rows = rows.filter((row) =>
        m.columns.some(
          (col) =>
            U.normalize(row[col.key]).includes(q) ||
            (col.sub && U.normalize(row[col.sub]).includes(q)),
        ),
      );
    if (key === "agendamentos") {
      if (state.agendaDate)
        rows = rows.filter((r) => r.data === state.agendaDate);
      if (state.agendaDoctor)
        rows = rows.filter((r) => r.medicoId === state.agendaDoctor);
      if (state.agendaStatus)
        rows = rows.filter((r) => r.status === state.agendaStatus);
      if (state.agendaView === "semana")
        rows = rows.filter(
          (r) => r.data >= state.week && r.data <= U.addDays(state.week, 4),
        );
    }
    const sort = state.sort[key] || (key === "agendamentos" ? "date" : "name");
    rows.sort((a, b) =>
      sort === "date"
        ? U.compare(a.data + a.hora, b.data + b.hora)
        : sort === "recent"
          ? db[key].indexOf(b.raw) - db[key].indexOf(a.raw)
          : U.compare(a.nome || a.paciente, b.nome || b.paciente),
    );
    return rows;
  }
  function entityPage(key) {
    const m = modules[key],
      rows = filtered(key),
      count = ClinicStore.get(key).length,
      agenda = key === "agendamentos";
    return `<div class="page-heading"><div><span class="eyebrow">${agenda ? "TEMPO PARA CUIDAR" : "GESTÃO DA CLÍNICA"}</span><h1>${m.title}<span class="text-accent">.</span></h1><p>${m.description}</p></div><div class="heading-actions"><button class="button secondary" data-action="csv" data-entity="${key}">${I("download")}<span>Exportar CSV</span></button>${buttonNew(key)}</div></div>
    ${agenda ? `<div class="agenda-summary"><div><span class="stat-icon mint">${I("calendar")}</span><span><strong>${ClinicStore.get(key).filter((a) => a.data === U.localDate() && U.active(a)).length}</strong> consultas hoje</span></div><div><span class="legend-dot green"></span>${ClinicStore.get(key).filter((a) => a.status === "confirmada" && U.future(a)).length} confirmadas para os próximos atendimentos</div><span class="hours-label">${I("clock")} Seg–Sex · 08:00–18:00</span></div>` : ""}
    <section class="panel registry-panel"><div class="list-toolbar"><div class="list-title"><h2>${agenda ? "Agenda da clínica" : m.title + " cadastrad" + (m.article === "a" ? "as" : "os")}</h2><span class="count-badge">${count}</span></div>${agenda ? `<div class="segmented" aria-label="Visualização da agenda"><button data-action="agenda-view" data-view="lista" class="${state.agendaView === "lista" ? "selected" : ""}" aria-pressed="${state.agendaView === "lista"}">${I("list")}Lista</button><button data-action="agenda-view" data-view="semana" class="${state.agendaView === "semana" ? "selected" : ""}" aria-pressed="${state.agendaView === "semana"}">${I("calendar")}Semana</button></div>` : '<span class="list-hint">Todos os dados, em um só lugar</span>'}</div>
    <div class="filter-bar"><div class="search-field">${I("search")}<input id="list-search" type="search" placeholder="${agenda ? "Buscar paciente, médico ou sala…" : "Buscar em " + m.title.toLowerCase() + "…"}" value="${E(state.search[key] || "")}" aria-label="Buscar em ${m.title}"></div>${agenda ? agendaFilters() : `<label class="sort-label"><span>Ordenar:</span><select id="list-sort" aria-label="Ordenar registros"><option value="name">Nome (A–Z)</option><option value="recent" ${state.sort[key] === "recent" ? "selected" : ""}>Mais recentes</option></select></label>`}</div>
    <div id="list-results">${listResults(key, rows)}</div></section>
    <p class="page-footnote">${I("info")}${agenda ? "As consultas consideram a duração completa para evitar sobreposição de horários." : "Cadastros vinculados são protegidos: remova ou atualize os vínculos antes de excluir."}</p>`;
  }
  function agendaFilters() {
    const db = ClinicStore.snapshot();
    return `<select id="agenda-doctor" aria-label="Filtrar por médico"><option value="">Todos os médicos</option>${db.medicos.map((m) => `<option value="${E(m.id)}" ${state.agendaDoctor === m.id ? "selected" : ""}>${E(m.nome)}</option>`).join("")}</select><select id="agenda-status" aria-label="Filtrar por situação"><option value="">Todas as situações</option>${Object.entries(
      modules.agendamentos.statuses,
    )
      .map(
        ([v, s]) =>
          `<option value="${v}" ${state.agendaStatus === v ? "selected" : ""}>${s.label}</option>`,
      )
      .join(
        "",
      )}</select>${state.agendaView === "lista" ? `<input id="agenda-date" type="date" aria-label="Filtrar por data" value="${state.agendaDate}">` : ""}<button class="icon-button" data-action="clear-filters" title="Limpar filtros" aria-label="Limpar filtros">${I("refresh")}</button>`;
  }
  function listResults(key, rows = filtered(key)) {
    if (key === "agendamentos" && state.agendaView === "semana")
      return weekView(rows);
    const m = modules[key],
      size = 8,
      totalPages = Math.max(1, Math.ceil(rows.length / size));
    state.pagination[key] = Math.min(state.pagination[key] || 1, totalPages);
    const page = state.pagination[key],
      visible = rows.slice((page - 1) * size, page * size);
    if (!rows.length)
      return empty(
        ClinicStore.get(key).length
          ? "Nenhum resultado por aqui"
          : "Tudo pronto para o primeiro cadastro",
        ClinicStore.get(key).length
          ? "Tente outro termo de busca ou limpe os filtros."
          : `Clique em “Nov${m.article} ${m.singular}” para começar.`,
        m.icon,
        ClinicStore.get(key).length
          ? '<button class="button secondary small" data-action="clear-filters">Limpar busca e filtros</button>'
          : buttonNew(key),
      );
    return `<div class="table-scroll"><table><thead><tr>${m.columns.map((c) => `<th scope="col">${c.label}</th>`).join("")}<th scope="col" class="actions-heading">Ações</th></tr></thead><tbody>${visible.map((row, i) => `<tr>${m.columns.map((c) => `<td data-label="${c.label}">${cell(c, row, (page - 1) * size + i)}</td>`).join("")}<td class="row-actions" data-label="Ações">${key === "agendamentos" && U.active(row) && !["concluida", "em_atendimento"].includes(row.status) ? `<button class="icon-button amber-action" data-action="cancel" data-id="${E(row.id)}" title="Cancelar consulta" aria-label="Cancelar consulta de ${E(row.paciente)}">${I("x")}</button>` : ""}<button class="icon-button edit-action" data-action="edit" data-entity="${key}" data-id="${E(row.id)}" title="Editar" aria-label="Editar ${E(row.nome || row.paciente)}">${I("edit")}</button><button class="icon-button delete-action" data-action="delete" data-entity="${key}" data-id="${E(row.id)}" title="Excluir" aria-label="Excluir ${E(row.nome || row.paciente)}">${I("trash")}</button></td></tr>`).join("")}</tbody></table></div><div class="pagination"><span>Exibindo <strong>${(page - 1) * size + 1}–${Math.min(page * size, rows.length)}</strong> de <strong>${rows.length}</strong> registros</span><div><button class="icon-button" data-action="paginate" data-delta="-1" aria-label="Página anterior" ${page === 1 ? "disabled" : ""}>${I("left")}</button><span class="page-number">${page} / ${totalPages}</span><button class="icon-button" data-action="paginate" data-delta="1" aria-label="Próxima página" ${page === totalPages ? "disabled" : ""}>${I("chevron")}</button></div></div>`;
  }
  function cell(col, row, i) {
    let value = row[col.key] ?? "—";
    if (col.type === "person")
      return `<div class="person-cell"><span class="avatar avatar-${i % 4}">${E(U.initials(value))}</span><span><strong>${E(value)}</strong>${col.sub ? `<small>${E(row[col.sub] || "—")}</small>` : ""}</span></div>`;
    if (col.type === "status") return statusBadge(value);
    if (col.type === "tag") return `<span class="tag">${E(value)}</span>`;
    return `<span class="cell-main">${E(value)}</span>${col.sub ? `<small class="cell-sub">${E(row[col.sub] || "—")}</small>` : ""}`;
  }
  function weekView(rows) {
    const today = U.localDate();
    return `<div class="week-controls"><div><button class="icon-button" data-action="week" data-delta="-7" aria-label="Semana anterior">${I("left")}</button><strong>${U.date(state.week)} — ${U.date(U.addDays(state.week, 4), { year: "numeric" })}</strong><button class="icon-button" data-action="week" data-delta="7" aria-label="Próxima semana">${I("chevron")}</button></div><button class="button secondary small" data-action="current-week">Esta semana</button></div><div class="week-scroll"><div class="week-grid">${Array.from(
      { length: 5 },
      (_, i) => {
        const day = U.addDays(state.week, i),
          items = rows.filter((r) => r.data === day);
        return `<section class="week-day ${day === today ? "is-today" : ""}"><div class="week-day-header"><span>${["SEG", "TER", "QUA", "QUI", "SEX"][i]}</span><strong>${U.parseDate(day).getDate()}</strong><small>${items.length} consulta${items.length === 1 ? "" : "s"}</small></div><div class="week-day-items">${items.map((r) => `<button class="calendar-event ${E(r.status)}" data-action="edit" data-entity="agendamentos" data-id="${E(r.id)}"><span class="event-time">${r.hora}–${U.endTime(r)}</span><strong>${E(r.paciente)}</strong><small>${E(r.medico)}</small><small>${E(r.sala)}</small>${statusBadge(r.status)}</button>`).join("")}<button class="week-add" data-action="new" data-entity="agendamentos" data-date="${day}">${I("plus")}${items.length ? "Agendar" : "Horários livres"}</button></div></section>`;
      },
    ).join("")}</div></div>`;
  }
  function refreshResults() {
    const el = $("list-results");
    if (el) el.innerHTML = listResults(state.page);
  }
  function settings() {
    const db = ClinicStore.snapshot(),
      count = ClinicStore.entities.reduce((n, k) => n + db[k].length, 0),
      size = new Blob([JSON.stringify(db)]).size;
    return `<div class="page-heading"><div><span class="eyebrow">DO SEU JEITO</span><h1>Dados e preferências<span class="text-accent">.</span></h1><p>Seu ambiente organizado, com liberdade para levar os dados junto.</p></div><span class="pill">${I("database")}${count} registros locais</span></div><div class="settings-grid"><section class="panel settings-card"><span class="settings-icon mint">${I("sun")}</span><h2>Um tema para cada momento</h2><p>Escolha a aparência mais confortável para você.</p><div class="theme-options">${[
      ["claro", "sun", "Claro"],
      ["escuro", "moon", "Escuro"],
      ["sistema", "monitor", "Sistema"],
    ]
      .map(
        ([v, i, label]) =>
          `<button class="theme-option ${state.theme === v ? "selected" : ""}" data-action="theme" data-theme="${v}" aria-pressed="${state.theme === v}"><span class="theme-preview preview-${v}"><span></span><span></span><span></span></span><span>${I(i)}${label}${state.theme === v ? I("check") : ""}</span></button>`,
      )
      .join(
        "",
      )}</div></section><section class="panel settings-card"><span class="settings-icon lavender">${I("database")}</span><h2>Os dados ficam com você</h2><p>Os cadastros são salvos neste navegador e permanecem após fechar a página. Para trocar de computador ou levar pelo pendrive, exporte um backup e importe-o no destino.</p><div class="storage-stats"><span><strong>${count}</strong> registros</span><span><strong>${(size / 1024).toFixed(1)}</strong> KB utilizados</span></div><small class="muted">Última gravação: ${db.updatedAt ? new Date(db.updatedAt).toLocaleString("pt-BR") : "nenhuma"}. Cada navegador e endereço mantém seus próprios dados.</small></section><section class="panel settings-card"><span class="settings-icon peach">${I("download")}</span><h2>Leve o cuidado com você</h2><p>O backup JSON inclui os sete módulos e seus vínculos. A importação confere o arquivo e pede confirmação antes de substituir os dados atuais.</p><div class="settings-actions"><button class="button primary" data-action="export">${I("download")}Exportar backup</button><button class="button secondary" data-action="import">${I("upload")}Importar backup</button></div><div class="inline-note">${I("info")}O pendrive leva os arquivos do sistema. Os dados cadastrados viajam no backup JSON.</div></section><section class="panel settings-card"><span class="settings-icon yellow">${I("spark")}</span><h2>Prepare a próxima atividade</h2><p>Comece com cadastros fictícios para explorar o sistema ou com uma base vazia. Essas ações substituem os dados locais e precisam de confirmação.</p><div class="settings-actions"><button class="button secondary" data-action="demo">${I("refresh")}Carregar demonstração</button><button class="button danger subtle" data-action="reset">${I("trash")}Esvaziar cadastros</button></div><div class="inline-note">${I("shield")}Ambiente educacional: utilize somente dados fictícios.</div></section></div><section class="panel data-overview"><div class="panel-heading"><div><span class="eyebrow">TUDO CONECTADO</span><h2>Seus cadastros</h2></div></div><div class="data-counts">${ClinicStore.entities.map((k) => `<button data-action="navigate" data-page="${k}">${I(modules[k].icon)}<strong>${db[k].length}</strong><span>${modules[k].title}</span>${I("chevron")}</button>`).join("")}</div></section>`;
  }
  function sourceLabel(source, row) {
    const db = ClinicStore.snapshot();
    if (source === "medicos")
      return `${row.nome} · ${db.especialidades.find((e) => e.id === row.especialidadeId)?.nome || row.crm}`;
    if (source === "salas") return `${row.nome} (${row.sigla})`;
    if (source === "pacientes") return `${row.nome} · ${U.cpfFormat(row.cpf)}`;
    return row.nome;
  }
  function fieldHTML(f, row) {
    let value = row[f.key] ?? f.default ?? "";
    const id = `field-${f.key}`,
      required = f.required ? ' <span class="required-star">*</span>' : "",
      common = `id="${id}" name="${f.key}" ${f.required ? "required" : ""} aria-describedby="error-${f.key}${f.helper ? " help-" + f.key : ""}"`;
    let control;
    if (f.type === "weekdays")
      return `<fieldset class="field wide days-field"><legend>${f.label}${required}</legend><div class="weekday-options">${[1, 2, 3, 4, 5].map((d, i) => `<label><input type="checkbox" name="${f.key}" value="${d}" ${(value || []).includes(d) ? "checked" : ""}><span>${["Seg", "Ter", "Qua", "Qui", "Sex"][i]}</span></label>`).join("")}</div><p id="error-${f.key}" class="field-error"></p></fieldset>`;
    if (f.type === "select" || f.options) {
      let options = f.source
        ? ClinicStore.get(f.source)
            .sort((a, b) => U.compare(a.nome, b.nome))
            .map((r) => ({ value: r.id, label: sourceLabel(f.source, r) }))
        : f.options.map((o) =>
            typeof o === "object"
              ? o
              : { value: o, label: f.type === "number" ? `${o} minutos` : o },
          );
      control = `<select ${common}>${f.source ? `<option value="">${E(f.placeholder || "Selecione")}</option>` : ""}${options.map((o) => `<option value="${E(o.value)}" ${String(value) === String(o.value) ? "selected" : ""}>${E(o.label)}</option>`).join("")}</select>`;
    } else if (f.type === "textarea")
      control = `<textarea ${common} rows="3" maxlength="1000" placeholder="${E(f.placeholder || "")}">${E(value)}</textarea>`;
    else {
      if (f.mask === "cpf") value = U.cpfFormat(value);
      if (f.mask === "phone") value = U.phoneFormat(value);
      control = `<input ${common} type="${f.type || "text"}" value="${E(value)}" placeholder="${E(f.placeholder || "")}" ${f.max ? `maxlength="${f.max}"` : ""} ${f.mask ? `data-mask="${f.mask}" inputmode="numeric"` : ""} ${f.type === "time" ? 'step="60"' : ""} ${f.key === "nascimento" ? `max="${U.localDate()}"` : ""} ${["nome", "localizacao"].includes(f.key) ? 'maxlength="120"' : ""}>`;
    }
    const help =
      f.source && !ClinicStore.get(f.source).length
        ? `<small class="field-helper">Nenhum cadastro disponível. <button type="button" class="inline-link" data-action="related" data-page="${f.source}">Ir para ${modules[f.source].title.toLowerCase()}</button></small>`
        : f.helper
          ? `<small class="field-helper" id="help-${f.key}">${E(f.helper)}</small>`
          : "";
    return `<div class="field ${f.wide ? "wide" : ""}"><label for="${id}">${f.label}${required}</label>${control}${help}<p class="field-error" id="error-${f.key}"></p></div>`;
  }
  function openEditor(key, id = "", prefill = {}) {
    const m = modules[key],
      record = id ? ClinicStore.get(key).find((r) => r.id === id) : null;
    if (id && !record)
      return toast("Registro não encontrado. Atualize a lista.", "error");
    const fields = record ? m.editFields : m.fields;
    state.editing = { key, id, original: record, fields };
    $("editor-dialog").dataset.module = key;
    $("editor-dialog").dataset.mode = record ? "manutencao" : "cadastro";
    const row = record || { ...prefill };
    if (key === "agendamentos" && !record) {
      row.data = row.data || U.localDate();
      row.status = "agendada";
    }
    $("editor-kicker").textContent =
      key === "agendamentos" ? "AGENDA DA CLÍNICA" : "GESTÃO DA CLÍNICA";
    $("editor-title").textContent = id
      ? `Editar ${m.singular}`
      : `Nov${m.article} ${m.singular}`;
    $("form-intro").textContent =
      key === "agendamentos"
        ? "Selecione paciente, médico e sala. Vamos conferir os horários para você."
        : "Preencha as informações abaixo para manter os cadastros atualizados.";
    $("form-fields").innerHTML = fields
      .map((f) => fieldHTML(f, row))
      .join("");
    $("form-error").hidden = true;
    $("availability-note").innerHTML = "";
    $("save-button").innerHTML =
      `${I("check")}${id ? "Salvar alterações" : key === "agendamentos" ? "Agendar consulta" : "Salvar cadastro"}`;
    if (key === "agendamentos") availability();
    state.editorBaseline = JSON.stringify(readForm());
    $("editor-dialog").showModal();
  }
  function readForm() {
    if (!state.editing) return {};
    const form = new FormData($("record-form")),
      m = modules[state.editing.key],
      d = { id: state.editing.id };
    state.editing.fields.forEach((f) => {
      d[f.key] =
        f.type === "weekdays"
          ? form.getAll(f.key).map(Number)
          : f.type === "number"
            ? Number(form.get(f.key))
            : U.text(form.get(f.key));
    });
    return d;
  }
  async function closeEditor(force = false) {
    if (
      !force &&
      state.editing &&
      JSON.stringify(readForm()) !== state.editorBaseline
    ) {
      if (
        !(await confirmAction(
          "Descartar alterações?",
          "Há informações não salvas neste formulário.",
          "Descartar",
          true,
        ))
      )
        return false;
    }
    $("editor-dialog").close();
    state.editing = null;
    return true;
  }
  function formError(err) {
    $("form-error").textContent = err.message || "Não foi possível salvar.";
    $("form-error").hidden = false;
    document
      .querySelectorAll(".field-error")
      .forEach((e) => (e.textContent = ""));
    document
      .querySelectorAll("[aria-invalid]")
      .forEach((e) => e.removeAttribute("aria-invalid"));
    for (const [key, message] of Object.entries(err.fields || {})) {
      const el = $(`error-${key}`);
      if (el) el.textContent = message;
      const control = $(`field-${key}`);
      if (control) control.setAttribute("aria-invalid", "true");
    }
    const first = Object.keys(err.fields || {})[0];
    const target = $(`field-${first}`) || $("form-error");
    target.tabIndex = target === $("form-error") ? -1 : target.tabIndex;
    target.focus();
    target.scrollIntoView({ block: "nearest" });
  }
  function availability() {
    if (state.editing?.key !== "agendamentos") return;
    const d = readForm(),
      doctor = ClinicStore.get("medicos").find((m) => m.id === d.medicoId);
    $("availability-note").innerHTML =
      `<div class="availability-card"><span class="availability-icon">${I("clock")}</span><div><strong>${doctor ? "Disponibilidade de " + E(doctor.nome) : "Encontre um horário livre"}</strong><p>${doctor ? `${E(U.weekdays(doctor.diasAtendimento))} · ${E(doctor.horaInicio)}–${E(doctor.horaFim)}` : "Selecione paciente, médico, sala e data para consultar os horários."}</p><button type="button" class="inline-link" data-action="slots">${I("spark")}Sugerir horários disponíveis</button><div id="available-slots"></div></div></div>`;
  }
  function suggestSlots() {
    const d = readForm();
    if (!d.pacienteId || !d.medicoId || !d.salaId || !d.data) {
      $("available-slots").innerHTML =
        '<p class="field-helper">Preencha paciente, médico, sala e data primeiro.</p>';
      return;
    }
    const slots = modules.agendamentos.horariosDisponiveis(d);
    $("available-slots").innerHTML = slots.length
      ? `<div class="slot-grid">${slots.map((h) => `<button class="slot ${h === d.hora ? "selected" : ""}" type="button" data-action="slot" data-time="${h}">${h}</button>`).join("")}</div>`
      : '<p class="field-helper">Nenhum horário disponível para essa combinação. Confira o dia e a disponibilidade do médico.</p>';
  }
  let confirmResolve = null;
  function confirmAction(
    title,
    message,
    label = "Confirmar",
    danger = false,
    extra = "",
  ) {
    if (confirmResolve) return Promise.resolve(false);
    $("confirm-title").textContent = title;
    $("confirm-message").textContent = message;
    $("confirm-extra").innerHTML = extra;
    $("confirm-yes").textContent = label;
    $("confirm-yes").className = `button ${danger ? "danger" : "primary"}`;
    $("confirm-icon").className = `confirm-icon ${danger ? "danger-icon" : ""}`;
    $("confirm-dialog").showModal();
    $("confirm-no").focus();
    return new Promise((resolve) => (confirmResolve = resolve));
  }
  function resolveConfirm(value) {
    $("confirm-dialog").close();
    if (confirmResolve) {
      const fn = confirmResolve;
      confirmResolve = null;
      fn(value);
    }
  }
  function toast(message, type = "success") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = `<span>${I(type === "error" ? "alert" : "check")}</span><p>${E(message)}</p><button class="icon-button" aria-label="Fechar aviso">${I("x")}</button>`;
    el.querySelector("button").onclick = () => el.remove();
    $("toasts").append(el);
    setTimeout(() => el.remove(), 6000);
  }
  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type })),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function exportBackup() {
    download(
      JSON.stringify(
        { ...ClinicStore.snapshot(), exportedAt: new Date().toISOString() },
        null,
        2,
      ),
      `clinica-vida-backup-${U.localDate()}.json`,
      "application/json",
    );
    toast(
      "Backup exportado. Guarde o arquivo para importar em outro computador.",
    );
  }
  function csv(key) {
    const m = modules[key],
      rows = filtered(key);
    if (!rows.length) return toast("Não há registros para exportar.", "error");
    const value = (v) => {
      let s = String(v ?? "");
      if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const data = [
      m.columns.map((c) => value(c.label)).join(";"),
      ...rows.map((row) =>
        m.columns
          .map((c) =>
            value(
              c.type === "status"
                ? modules.agendamentos.statuses[row[c.key]]?.label
                : row[c.key],
            ),
          )
          .join(";"),
      ),
    ].join("\r\n");
    download(
      "\uFEFF" + data,
      `clinica-vida-${key}-${U.localDate()}.csv`,
      "text/csv;charset=utf-8",
    );
    toast("CSV exportado com os registros filtrados.");
  }
  async function importFile(file) {
    try {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024)
        throw new ClinicError("O backup deve ter até 5 MB.");
      let raw;
      try {
        raw = JSON.parse(await file.text());
      } catch (_) {
        throw new ClinicError("Este arquivo não contém um JSON válido.");
      }
      const db = ClinicStore.validateBackup(raw);
      const total = ClinicStore.entities.reduce(
          (sum, k) => sum + db[k].length,
          0,
        ),
        extra = `<div class="import-summary">${ClinicStore.entities.map((k) => `<span>${modules[k].title}<strong>${db[k].length}</strong></span>`).join("")}</div>`;
      if (
        await confirmAction(
          "Importar este backup?",
          `${total} registros foram validados. A importação substituirá os cadastros atuais deste navegador. Exporte um backup antes se quiser guardá-los.`,
          "Importar e substituir",
          true,
          extra,
        )
      ) {
        ClinicStore.replace(db, "Backup importado.");
        render();
        toast("Backup importado com sucesso.");
      }
    } catch (err) {
      toast(err.message || "Falha ao importar o arquivo.", "error");
    } finally {
      $("import-file").value = "";
    }
  }
  async function action(el) {
    const a = el.dataset.action,
      key = el.dataset.entity,
      id = el.dataset.id;
    if (a === "navigate") navigate(el.dataset.page);
    else if (a === "home-theme") $("theme-toggle").click();
    else if (a === "home-book") {
      navigate("agendamentos");
      openEditor("agendamentos");
    } else if (a === "new")
      openEditor(key, "", el.dataset.date ? { data: el.dataset.date } : {});
    else if (a === "edit") openEditor(key, id);
    else if (a === "close-editor") await closeEditor();
    else if (a === "related") {
      const page = el.dataset.page;
      if (await closeEditor()) {
        navigate(page);
        openEditor(page);
      }
    } else if (a === "delete") {
      const m = modules[key],
        row = ClinicStore.get(key).find((r) => r.id === id);
      if (!row) return;
      const name = row.nome || `${U.date(row.data)} às ${row.hora}`;
      if (
        await confirmAction(
          `Excluir ${m.singular}?`,
          m.deletePreview(row, ClinicStore.snapshot()),
          "Excluir registro",
          true,
        )
      ) {
        m.excluir(id);
        render();
        toast("Registro excluído.");
      }
    } else if (a === "cancel") {
      const row = ClinicStore.get("agendamentos").find((r) => r.id === id);
      if (
        row &&
        (await confirmAction(
          "Cancelar esta consulta?",
          "O registro será mantido no histórico e o horário ficará disponível para outro agendamento.",
          "Cancelar consulta",
          true,
        ))
      ) {
        modules.agendamentos.salvar({ ...row, status: "cancelada" }, row);
        render();
        toast("Consulta cancelada. O horário foi liberado.");
      }
    } else if (a === "paginate") {
      state.pagination[state.page] =
        (state.pagination[state.page] || 1) + Number(el.dataset.delta);
      refreshResults();
    } else if (a === "clear-filters") {
      state.search[state.page] = "";
      state.agendaDate = "";
      state.agendaDoctor = "";
      state.agendaStatus = "";
      state.pagination[state.page] = 1;
      render();
    } else if (a === "agenda-view") {
      state.agendaView = el.dataset.view;
      state.agendaDate = "";
      render();
    } else if (a === "agenda-day") {
      state.agendaDate = el.dataset.date;
      state.agendaView = "lista";
      navigate("agendamentos");
    } else if (a === "week") {
      state.week = U.addDays(state.week, Number(el.dataset.delta));
      refreshResults();
    } else if (a === "current-week") {
      state.week = U.monday(U.localDate());
      refreshResults();
    } else if (a === "slots") suggestSlots();
    else if (a === "slot") {
      $("field-hora").value = el.dataset.time;
      document
        .querySelectorAll(".slot")
        .forEach((s) => s.classList.toggle("selected", s === el));
    } else if (a === "theme") {
      themeApply(el.dataset.theme);
      if (state.page === "dados") render();
    } else if (a === "export") exportBackup();
    else if (a === "import") $("import-file").click();
    else if (a === "csv") csv(key);
    else if (a === "demo" || a === "reset") {
      const demo = a === "demo";
      if (
        await confirmAction(
          demo
            ? "Carregar dados de demonstração?"
            : "Esvaziar todos os cadastros?",
          demo
            ? "Os dados atuais serão substituídos por exemplos fictícios. Exporte um backup antes para preservá-los."
            : "Todos os cadastros e consultas deste navegador serão removidos. Exporte um backup antes para preservá-los.",
          demo ? "Carregar demonstração" : "Esvaziar cadastros",
          true,
        )
      ) {
        ClinicStore.replace(
          demo ? ClinicDemo.create() : ClinicStore.empty(),
          demo ? "Demonstração carregada." : "Cadastros esvaziados.",
        );
        render();
        toast(
          demo
            ? "Demonstração pronta para explorar."
            : "Base vazia, pronta para começar.",
        );
      }
    }
  }
  function init() {
    ClinicHome.mount();
    ClinicStore.initialize(ClinicDemo.create());
    ClinicIcons.hydrate();
    try {
      state.theme = localStorage.getItem("clinica_vida_tema") || "sistema";
    } catch (_) {}
    themeApply(state.theme);
    $("topbar-date").textContent = new Date()
      .toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
      .replace(/\./g, "");
    if (ClinicStore.loadError) {
      $("storage-warning").textContent = ClinicStore.loadError;
      $("storage-warning").hidden = false;
      $("storage-label").textContent = "Armazenamento indisponível";
    }
    const hash = location.hash.slice(1);
    state.page = Object.hasOwn(titles, hash) ? hash : "home";
    render();
    if (ClinicHome.isSection(hash)) ClinicHome.scrollToSection(hash, true);
    document.querySelector(".skip-link").addEventListener("click", (event) => {
      event.preventDefault();
      const target = $(state.page === "home" ? "home-main" : "main-content");
      target.focus();
      target.scrollIntoView({ block: "start" });
    });
    document.addEventListener("click", (event) => {
      const el = event.target.closest("[data-action]");
      if (el) {
        event.preventDefault();
        Promise.resolve(action(el)).catch((err) =>
          toast(err.message || "Não foi possível concluir a ação.", "error"),
        );
      }
    });
    document.addEventListener("input", (event) => {
      if (event.target.id === "list-search") {
        state.search[state.page] = event.target.value;
        state.pagination[state.page] = 1;
        refreshResults();
      }
      if (event.target.dataset.mask) {
        const mask = event.target.dataset.mask;
        event.target.value =
          mask === "cpf"
            ? U.cpfFormat(event.target.value)
            : U.phoneFormat(event.target.value);
      }
    });
    document.addEventListener("change", (event) => {
      const el = event.target;
      if (el.id === "list-sort") {
        state.sort[state.page] = el.value;
        refreshResults();
      }
      const filters = {
        "agenda-doctor": "agendaDoctor",
        "agenda-status": "agendaStatus",
        "agenda-date": "agendaDate",
      };
      if (filters[el.id]) {
        state[filters[el.id]] = el.value;
        state.pagination.agendamentos = 1;
        refreshResults();
      }
      if (
        state.editing?.key === "agendamentos" &&
        ["medicoId", "data", "duracao", "pacienteId", "salaId"].includes(
          el.name,
        )
      )
        availability();
    });
    $("record-form").addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        const { key, original } = state.editing;
        modules[key].salvar(readForm(), original);
        closeEditor(true);
        render();
        toast(
          key === "agendamentos"
            ? "Consulta salva com sucesso."
            : "Cadastro salvo com sucesso.",
        );
      } catch (err) {
        formError(err);
      }
    });
    $("editor-dialog").addEventListener("cancel", (event) => {
      event.preventDefault();
      closeEditor();
    });
    $("editor-dialog").addEventListener("click", (event) => {
      if (event.target === $("editor-dialog")) {
        const r = $("editor-dialog").getBoundingClientRect();
        if (
          event.clientX < r.left ||
          event.clientX > r.right ||
          event.clientY < r.top ||
          event.clientY > r.bottom
        )
          closeEditor();
      }
    });
    $("confirm-no").onclick = () => resolveConfirm(false);
    $("confirm-yes").onclick = () => resolveConfirm(true);
    $("confirm-dialog").addEventListener("cancel", (event) => {
      event.preventDefault();
      resolveConfirm(false);
    });
    $("theme-toggle").onclick = () => {
      themeApply(
        document.documentElement.dataset.theme === "escuro"
          ? "claro"
          : "escuro",
      );
      if (state.page === "dados") render();
    };
    matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      () => {
        if (state.theme === "sistema") themeApply("sistema");
      },
    );
    $("mobile-menu").onclick = () => {
      const open = $("sidebar").classList.toggle("open");
      $("sidebar-overlay").hidden = !open;
      $("mobile-menu").setAttribute("aria-expanded", String(open));
    };
    $("sidebar-overlay").onclick = closeMenu;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("hashchange", () =>
      navigate(location.hash.slice(1)),
    );
    $("import-file").addEventListener("change", (e) =>
      importFile(e.target.files[0]),
    );
    window.addEventListener("clinic:external", () => {
      render();
      toast(
        "Dados atualizados por outra aba. Reabra formulários em edição antes de salvar.",
      );
    });
    window.addEventListener("beforeunload", (event) => {
      if (
        state.editing &&
        JSON.stringify(readForm()) !== state.editorBaseline
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
    if (ClinicStore.migrated)
      toast("Os cadastros da versão anterior foram preservados.");
  }
  document.addEventListener("DOMContentLoaded", init);
  return { navigate, render, openEditor, state, exportBackup, importFile };
})();
