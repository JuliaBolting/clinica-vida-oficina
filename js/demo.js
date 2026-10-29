/* Dados exclusivamente fictícios e relativos à data de abertura. */
window.ClinicDemo = {
  create() {
    const db = ClinicStore.empty(),
      u = ClinicUtils;
    db.especialidades = [
      ["esp-clinica", "Clínica geral", "Acompanhamento integral da saúde."],
      ["esp-cardio", "Cardiologia", "Cuidado com a saúde do coração."],
      ["esp-derma", "Dermatologia", "Saúde da pele, cabelos e unhas."],
      [
        "esp-pediatria",
        "Pediatria",
        "Acompanhamento de crianças e adolescentes.",
      ],
    ].map(([id, nome, descricao]) => ({ id, nome, descricao }));
    db.convenios = [
      ["conv-vida", "Vida Saúde", "VS001"],
      ["conv-bem", "Bem Estar", "BE002"],
      ["conv-plena", "Plena Saúde", "PS003"],
    ].map(([id, nome, codigo]) => ({
      id,
      nome,
      codigo,
      telefone: "4933330000",
      observacoes: "Convênio fictício para a oficina.",
    }));
    db.secretarias = [
      {
        id: "sec-ana",
        nome: "Ana Souza",
        email: "ana@exemplo.com",
        telefone: "49990000001",
        turno: "Manhã",
      },
      {
        id: "sec-bruna",
        nome: "Bruna Lima",
        email: "bruna@exemplo.com",
        telefone: "49990000002",
        turno: "Tarde",
      },
    ];
    db.salas = [
      ["sala-1", "Consultório Horizonte", "S01", "Térreo · Ala A"],
      ["sala-2", "Consultório Jardim", "S02", "Térreo · Ala A"],
      ["sala-3", "Consultório Aurora", "S03", "1º andar · Ala B"],
      ["sala-4", "Consultório Sereno", "S04", "1º andar · Ala B"],
    ].map(([id, nome, sigla, localizacao]) => ({
      id,
      nome,
      sigla,
      localizacao,
      observacoes: "",
    }));
    db.medicos = [
      ["med-marina", "Dra. Marina Costa", "CRM/SC 10001", "esp-clinica"],
      ["med-rafael", "Dr. Rafael Martins", "CRM/SC 10002", "esp-cardio"],
      ["med-helena", "Dra. Helena Rocha", "CRM/SC 10003", "esp-derma"],
      ["med-pedro", "Dr. Pedro Azevedo", "CRM/SC 10004", "esp-pediatria"],
    ].map(([id, nome, crm, especialidadeId]) => ({
      id,
      nome,
      crm,
      especialidadeId,
      diasAtendimento: [1, 2, 3, 4, 5],
      horaInicio: "08:00",
      horaFim: "18:00",
    }));
    function fakeCPF(n) {
      let s = String(987650000 + n);
      for (let k = 9; k <= 10; k++) {
        let total = 0;
        for (let i = 0; i < k; i++) total += Number(s[i]) * (k + 1 - i);
        const d = (total * 10) % 11;
        s += d === 10 ? "0" : String(d);
      }
      return s;
    }
    db.pacientes = [
      "Camila Almeida",
      "Lucas Ferreira",
      "Beatriz Santos",
      "Gabriel Oliveira",
      "Sofia Ribeiro",
      "Arthur Mendes",
      "Isabela Castro",
      "Miguel Pereira",
    ].map((nome, i) => ({
      id: `pac-${i + 1}`,
      nome,
      cpf: fakeCPF(i),
      telefone: `499900000${String(i + 10)}`,
      nascimento: `${1985 + i}-0${(i % 8) + 1}-15`,
      email: `paciente${i + 1}@exemplo.com`,
      convenioId: i % 4 === 3 ? "" : db.convenios[i % 3].id,
      observacoes: "Cadastro fictício para demonstração.",
    }));
    let day = u.localDate();
    if (new Date().getHours() >= 9) day = u.addDays(day, 1);
    while (![1, 2, 3, 4, 5].includes(u.parseDate(day).getDay()))
      day = u.addDays(day, 1);
    for (let i = 0; i < 10; i++) {
      if (i && i % 2 === 0) {
        day = u.addDays(day, 1);
        while (![1, 2, 3, 4, 5].includes(u.parseDate(day).getDay()))
          day = u.addDays(day, 1);
      }
      db.agendamentos.push({
        id: `consulta-${i + 1}`,
        pacienteId: db.pacientes[i % 8].id,
        medicoId: db.medicos[i % 4].id,
        salaId: db.salas[i % 4].id,
        data: day,
        hora: i % 2 ? "14:30" : "09:00",
        duracao: 30,
        status: i % 3 === 0 ? "confirmada" : "agendada",
        secretariaId: db.secretarias[i % 2].id,
        observacoes: i === 0 ? "Primeiro atendimento." : "",
      });
    }
    return db;
  },
};
