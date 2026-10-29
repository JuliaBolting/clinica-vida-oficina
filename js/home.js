/* Apresentação institucional. A interface e as regras da gestão permanecem em app.js. */
window.ClinicHome = (() => {
  const icon = (name) => ClinicIcons.get(name);
  const sectionIds = [
    "home-sobre",
    "home-especialidades",
    "home-como-funciona",
    "home-duvidas",
  ];
  let active = false;
  let observer = null;
  let ticking = false;
  const brand = `<span class="brand-mark">${icon("cross")}</span><span><strong>clínica<span class="brand-light">vida</span><span class="brand-dot">.</span></strong><small>CUIDADO QUE ACOLHE</small></span>`;
  const specialtyData = [
    {
      name: "Clínica geral",
      icon: "doctor",
      description:
        "Um olhar integral para a sua saúde e para os cuidados do dia a dia.",
      note: "O primeiro passo para se cuidar.",
    },
    {
      name: "Cardiologia",
      icon: "heart",
      description:
        "Atenção à saúde do coração, com escuta e acompanhamento próximo.",
      note: "Cuidado em cada batida.",
    },
    {
      name: "Dermatologia",
      icon: "spark",
      description:
        "Cuidado com a pele, os cabelos e as unhas em diferentes fases da vida.",
      note: "Bem-estar que se sente na pele.",
    },
    {
      name: "Pediatria",
      icon: "users",
      description:
        "Acolhimento para as crianças e suas famílias, em cada nova descoberta.",
      note: "Pequenos passos, grandes cuidados.",
    },
  ];
  function mount() {
    const root = document.getElementById("clinic-home");
    if (!root || root.dataset.mounted) return;
    root.dataset.mounted = "true";
    root.innerHTML = `
      <header class="home-header" id="home-header">
        <div class="home-container home-header-inner">
          <a class="brand home-brand" href="#home" data-action="navigate" data-page="home" aria-label="Clínica Vida, página inicial">${brand}</a>
          <nav class="home-navigation" id="home-navigation" aria-label="Conheça a Clínica Vida">
            <a href="#home-sobre" data-home-scroll="home-sobre">A clínica</a>
            <a href="#home-especialidades" data-home-scroll="home-especialidades">Especialidades</a>
            <a href="#home-como-funciona" data-home-scroll="home-como-funciona">Como funciona</a>
            <a href="#home-duvidas" data-home-scroll="home-duvidas">Dúvidas</a>
          </nav>
          <div class="home-header-actions">
            <button class="home-theme-button" id="home-theme-toggle" data-action="home-theme" aria-label="Alternar tema" title="Alternar tema">${icon("moon")}</button>
            <a class="home-system-link" href="#inicio" data-action="navigate" data-page="inicio">Acessar sistema ${icon("arrowUp")}</a>
            <button class="home-menu-button" id="home-menu-button" aria-label="Abrir navegação da clínica" aria-controls="home-navigation" aria-expanded="false">${icon("menu")}</button>
          </div>
        </div>
        <div class="home-scroll-progress" aria-hidden="true"></div>
      </header>
      <main class="home-main" id="home-main" tabindex="-1">
        <section class="home-hero home-container" aria-labelledby="home-title">
          <div class="home-hero-copy">
            <span class="home-eyebrow"><span class="home-tiny-cross">${icon("cross")}</span> BEM-VINDO À CLÍNICA VIDA</span>
            <h1 id="home-title">Cuidar de você.<br>É da nossa<br><em>natureza.</em><span class="home-title-dot">*</span></h1>
            <p>Um lugar para ouvir, acolher e cuidar.<br>Porque a sua saúde merece atenção de verdade.</p>
            <div class="home-hero-actions"><button class="home-button home-button-primary" data-action="home-book">Agendar uma consulta <span>${icon("arrowUp")}</span></button><a class="home-text-link" href="#home-sobre" data-home-scroll="home-sobre">Conheça a clínica ${icon("arrow")}</a></div>
            <div class="home-hero-footnote"><span class="home-mini-icon">${icon("heart")}</span><span>Atendimento próximo.<br><strong>Cuidado em cada detalhe.</strong></span></div>
          </div>
          <div class="home-hero-visual">
            <span class="home-decor-orbit" aria-hidden="true"></span>
            <figure class="home-hero-photo"><img src="assets/home/acolhimento.webp" alt="Imagem ilustrativa de uma médica ouvindo uma paciente em um consultório acolhedor." width="1536" height="1024" fetchpriority="high" decoding="async"><figcaption><span class="home-photo-dot"></span> Aqui, a conversa também faz parte do cuidado.</figcaption></figure>
            <div class="home-floating-card"><span class="home-card-icon">${icon("heart")}</span><span><strong>Você no centro.</strong><small>Seu tempo. Sua história. Sua saúde.</small></span><span class="home-floating-spark" aria-hidden="true">✳</span></div>
            <span class="home-image-label">ESCUTA QUE ACOLHE. CUIDADO QUE CONECTA.</span>
          </div>
        </section>
        <div class="home-container"><div class="home-values-strip"><span>${icon("heart")} Atendimento humanizado</span><span>${icon("doctor")} Diferentes especialidades</span><span>${icon("calendar")} Uma rotina mais leve</span><a href="#home-sobre" data-home-scroll="home-sobre" aria-label="Role para conhecer a clínica">CONTINUE A DESCOBRIR <span>${icon("arrow")}</span></a></div></div>
        <section class="home-about home-container home-section" id="home-sobre" aria-labelledby="home-about-title">
          <div class="home-about-visual home-reveal"><figure class="home-space-photo"><img src="assets/home/espaco.webp" alt="Imagem ilustrativa de uma recepção com luz natural, plantas e poltronas em tons de verde." width="1536" height="1024" loading="lazy" decoding="async"></figure><div class="home-space-note"><span>UM RESPIRO NA ROTINA</span><strong>Para chegar.<br>Para conversar.<br>Para se sentir bem.</strong>${icon("cross")}</div></div>
          <div class="home-about-copy home-reveal"><span class="home-eyebrow">01 / A NOSSA ESSÊNCIA</span><h2 id="home-about-title">Antes de uma consulta,<br>um <em>encontro.</em></h2><p>Acreditamos que um bom cuidado começa quando alguém escuta. Por isso, a Clínica Vida reúne atenção, acolhimento e organização em uma experiência mais próxima de você.</p><p>Da primeira conversa ao próximo atendimento, cada detalhe tem um propósito: fazer você se sentir respeitado, orientado e à vontade.</p><div class="home-principles"><div><span>${icon("heart")}</span><div><h3>Escuta com atenção</h3><p>Espaço para suas perguntas e para a sua história.</p></div></div><div><span>${icon("shield")}</span><div><h3>Cuidado com respeito</h3><p>Cada pessoa tem um ritmo. Cada cuidado, um significado.</p></div></div><div><span>${icon("calendar")}</span><div><h3>Uma experiência organizada</h3><p>Equipe, espaços e horários conectados ao seu atendimento.</p></div></div></div><a class="home-text-link" href="#home-especialidades" data-home-scroll="home-especialidades">Encontre seu próximo cuidado ${icon("arrow")}</a></div>
        </section>
        <section class="home-specialties home-section" id="home-especialidades" aria-labelledby="home-specialties-title"><div class="home-container">
          <div class="home-section-heading home-reveal"><div><span class="home-eyebrow">02 / DIFERENTES OLHARES, O MESMO CUIDADO</span><h2 id="home-specialties-title">Sua saúde, em<br>boas <em>companhias.</em></h2></div><p>Especialidades que se complementam<br>para acompanhar cada fase da sua vida.</p></div>
          <div class="home-specialty-grid">${specialtyData.map((s, i) => `<article class="home-specialty-card home-reveal"><div class="home-specialty-top"><span class="home-specialty-icon">${icon(s.icon)}</span><span class="home-specialty-number">0${i + 1}</span></div><h3>${s.name}</h3><p>${s.description}</p><div class="home-specialty-bottom"><small>${s.note}</small><a href="#home-como-funciona" data-home-scroll="home-como-funciona" aria-label="Como agendar uma consulta de ${s.name}">${icon("arrowUp")}</a></div></article>`).join("")}</div>
          <div class="home-specialty-note home-reveal"><span>${icon("shield")} Atendimento particular e pelos convênios cadastrados na clínica.</span><a class="home-text-link" href="#convenios" data-action="navigate" data-page="convenios">Consultar convênios ${icon("arrow")}</a></div>
        </div></section>
        <section class="home-family-section home-container home-section"><div class="home-family-block home-reveal"><div class="home-family-copy"><span class="home-eyebrow">CUIDADO PARA A VIDA ACONTECER</span><h2>Mais presença.<br>Mais leveza.<br>Mais <em>vida.</em></h2><p>A saúde faz parte dos pequenos momentos. Um cuidado atento ajuda você a abrir espaço para aquilo que importa, em todas as fases da vida.</p><a class="home-button home-button-light" href="#home-como-funciona" data-home-scroll="home-como-funciona">Um próximo passo para você <span>${icon("arrowUp")}</span></a><span class="home-family-flower" aria-hidden="true">✳</span></div><figure class="home-family-photo"><img src="assets/home/cuidado.webp" alt="Imagem ilustrativa de uma família caminhando de mãos dadas em um jardim iluminado pelo sol." width="1536" height="1024" loading="lazy" decoding="async"></figure></div></section>
        <section class="home-how home-container home-section" id="home-como-funciona" aria-labelledby="home-how-title"><div class="home-section-heading home-reveal"><div><span class="home-eyebrow">03 / SIMPLES, DO PRIMEIRO PASSO EM DIANTE</span><h2 id="home-how-title">O seu próximo cuidado<br>começa <em>aqui.</em></h2></div><button class="home-button home-button-outline" data-action="home-book">Organizar meu atendimento ${icon("arrowUp")}</button></div><ol class="home-steps"><li class="home-reveal"><span class="home-step-number">01<span>${icon("specialty")}</span></span><h3>Encontre o cuidado</h3><p>Conheça as especialidades e escolha o profissional que acompanha a sua necessidade.</p></li><li class="home-reveal"><span class="home-step-number">02<span>${icon("calendar")}</span></span><h3>Combine o seu horário</h3><p>Consulte a agenda e organize o atendimento respeitando a disponibilidade da equipe.</p></li><li class="home-reveal"><span class="home-step-number">03<span>${icon("heart")}</span></span><h3>Venha como você é</h3><p>Traga suas perguntas e sua história. A nossa parte é acolher e cuidar dos detalhes.</p></li></ol></section>
        <section class="home-faq-section home-section" id="home-duvidas" aria-labelledby="home-faq-title"><div class="home-container home-faq-grid"><div class="home-faq-intro home-reveal"><span class="home-eyebrow">04 / PODE PERGUNTAR</span><h2 id="home-faq-title">A gente<br><em>conversa.</em></h2><p>Informação clara também é uma forma de acolher. Veja algumas respostas para chegar com mais tranquilidade.</p><div class="home-faq-hours">${icon("clock")}<span>DE SEGUNDA A SEXTA<strong>Das 08h às 18h</strong></span></div></div><div class="home-faq-list home-reveal"><details name="clinic-faq"><summary>Como faço para agendar uma consulta?<span>${icon("plus")}</span></summary><p>Clique em “Agendar uma consulta” para acessar a agenda da clínica. Reúna o paciente, o profissional, a sala e um horário disponível. O sistema ajuda a conferir a disponibilidade antes de confirmar o agendamento.</p></details><details name="clinic-faq"><summary>A clínica atende por convênio?<span>${icon("plus")}</span></summary><p>Você pode organizar atendimentos particulares ou associar o paciente a um dos convênios cadastrados. Consulte as opções disponíveis na área de convênios.</p><a class="home-text-link" href="#convenios" data-action="navigate" data-page="convenios">Ver convênios cadastrados ${icon("arrow")}</a></details><details name="clinic-faq"><summary>Posso remarcar ou cancelar uma consulta?<span>${icon("plus")}</span></summary><p>Sim. Na agenda, é possível editar a consulta para combinar outro horário ou cancelar o atendimento. A disponibilidade é conferida novamente ao remarcar, e o cancelamento libera o horário.</p><a class="home-text-link" href="#agendamentos" data-action="navigate" data-page="agendamentos">Acessar a agenda ${icon("arrow")}</a></details><details name="clinic-faq"><summary>Quais são os horários de atendimento?<span>${icon("plus")}</span></summary><p>A clínica atende de segunda a sexta-feira, das 08h às 18h. Cada médico possui seus próprios dias e horários de atendimento, que podem ser consultados ao agendar.</p></details></div></div></section>
        <section class="home-cta-section home-container home-section"><div class="home-final-cta home-reveal"><span class="home-cta-flower" aria-hidden="true">✳</span><span class="home-eyebrow">UM PASSO DE CADA VEZ</span><h2>Reserve um tempo<br>para <em>você.</em></h2><p>A sua saúde merece fazer parte da sua rotina.<br>A Clínica Vida está aqui para esse próximo cuidado.</p><button class="home-button home-button-primary" data-action="home-book">Vamos agendar? <span>${icon("arrowUp")}</span></button><span class="home-cta-note">Escuta. Acolhimento. Cuidado.</span></div></section>
      </main>
      <footer class="home-footer"><div class="home-container"><div class="home-footer-top"><div><a class="brand home-brand" href="#home" data-action="navigate" data-page="home" aria-label="Voltar ao início da Clínica Vida">${brand}</a><p>Um cuidado de cada vez.<br>Uma vida inteira de possibilidades.</p></div><div class="home-footer-links"><span>CONHEÇA A CLÍNICA</span><a href="#home-sobre" data-home-scroll="home-sobre">A nossa essência</a><a href="#home-especialidades" data-home-scroll="home-especialidades">Especialidades</a><a href="#home-duvidas" data-home-scroll="home-duvidas">Perguntas frequentes</a></div><div class="home-footer-links"><span>PARA ORGANIZAR O CUIDADO</span><a href="#agendamentos" data-action="navigate" data-page="agendamentos">Agenda da clínica ${icon("arrowUp")}</a><a href="#inicio" data-action="navigate" data-page="inicio">Acessar sistema ${icon("arrowUp")}</a><small>Segunda a sexta, 08h às 18h.</small></div></div><div class="home-footer-bottom"><span>Clínica Vida <span>·</span> Oficina Scrum / IFSC Lages</span><small>Clínica fictícia e imagens ilustrativas para uso educacional.</small><button data-home-top>Voltar ao topo ${icon("arrowUp")}</button></div></div></footer>
      <button class="home-back-top" id="home-back-top" data-home-top aria-label="Voltar ao topo da página" hidden>${icon("arrowUp")}</button>
    `;
    document.addEventListener("click", (event) => {
      const anchor = event.target.closest("[data-home-scroll]");
      if (anchor) {
        event.preventDefault();
        scrollToSection(anchor.dataset.homeScroll);
      }
      if (event.target.closest("[data-home-top]")) {
        event.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: motion() });
        try {
          history.replaceState(null, "", "#home");
        } catch (_) {}
      }
    });
    const menuButton = document.getElementById("home-menu-button");
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute(
        "aria-label",
        open ? "Fechar navegação da clínica" : "Abrir navegação da clínica",
      );
      menuButton.innerHTML = icon(open ? "x" : "menu");
      document
        .getElementById("home-navigation")
        .classList.toggle("is-open", open);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      // O ícone do botão é substituído ao abrir. O caminho original do evento
      // continua identificando o cabeçalho mesmo se o SVG clicado sair do DOM.
      if (
        !event.composedPath().includes(document.getElementById("home-header"))
      )
        closeMenu();
    });
    window.addEventListener(
      "scroll",
      () => {
        if (active && !ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            updateScroll();
            ticking = false;
          });
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", () => {
      if (innerWidth > 980) closeMenu();
      if (active) updateScroll();
    });
  }
  function motion() {
    return matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
  }
  function closeMenu() {
    const button = document.getElementById("home-menu-button");
    if (!button) return;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir navegação da clínica");
    button.innerHTML = icon("menu");
    document.getElementById("home-navigation").classList.remove("is-open");
  }
  function updateScroll() {
    const root = document.getElementById("clinic-home"),
      header = document.getElementById("home-header");
    if (!active || !root || !header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    const range = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty(
      "--home-scroll",
      `${range > 0 ? Math.min(100, (window.scrollY / range) * 100) : 0}%`,
    );
    document.getElementById("home-back-top").hidden = window.scrollY < 650;
    let current = "";
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 190) current = id;
    }
    document
      .querySelectorAll(".home-navigation [data-home-scroll]")
      .forEach((a) => {
        a.classList.toggle("is-current", a.dataset.homeScroll === current);
        if (a.dataset.homeScroll === current)
          a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
  }
  function activate() {
    active = true;
    closeMenu();
    const root = document.getElementById("clinic-home");
    if (
      "IntersectionObserver" in window &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.classList.add("is-animated");
      if (!observer) {
        observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
              }
            }),
          { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
        );
        root
          .querySelectorAll(".home-reveal")
          .forEach((el) => observer.observe(el));
      }
    }
    requestAnimationFrame(updateScroll);
  }
  function deactivate() {
    active = false;
    closeMenu();
  }
  function isSection(id) {
    return sectionIds.includes(id);
  }
  function scrollToSection(id, initial = false) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.ClinicApp?.state.page !== "home")
      window.ClinicApp.navigate("home");
    closeMenu();
    try {
      history.replaceState(null, "", `#${id}`);
    } catch (_) {}
    requestAnimationFrame(() => {
      el.scrollIntoView({
        block: "start",
        behavior: initial ? "instant" : motion(),
      });
    });
  }
  return { mount, activate, deactivate, isSection, scrollToSection };
})();
