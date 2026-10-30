/* Exemplo completo | Agendamentos. Regras locais no navegador, sem servidor. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.agendamentos = ClinicParts.agendamentos || {};
ClinicParts.agendamentos.crudBack = {
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const u = ClinicUtils,
      e = {};
    if (!u.reference(db, "pacientes", d.pacienteId))
      e.pacienteId = "Selecione um paciente cadastrado.";
    const medico = db.medicos.find((m) => m.id === d.medicoId);
    if (!medico) e.medicoId = "Selecione um médico cadastrado.";
    if (!u.reference(db, "salas", d.salaId))
      e.salaId = "Selecione uma sala cadastrada.";
    if (d.secretariaId && !u.reference(db, "secretarias", d.secretariaId))
      e.secretariaId = "A secretária selecionada não existe.";
    if (!u.validDate(d.data)) e.data = "Informe uma data válida.";
    if (!Number.isFinite(u.minutes(d.hora)))
      e.hora = "Informe um horário válido.";
    if (![15, 30, 45, 60, 90, 120].includes(Number(d.duracao)))
      e.duracao = "Escolha uma duração entre 15 e 120 minutos.";
    if (!Object.hasOwn(this.statuses, d.status))
      e.status = "Selecione uma situação válida.";
    if (u.text(d.observacoes).length > 1000)
      e.observacoes = "Use até 1.000 caracteres.";
    u.fail(e);
    const original = db.agendamentos.find((a) => a.id === d.id);
    const unchangedSlot =
      original &&
      ["data", "hora", "medicoId", "salaId", "pacienteId"].every(
        (k) => original[k] === d[k],
      ) &&
      Number(original.duracao || 30) === Number(d.duracao);
    const reactivated = original && !u.active(original) && u.active(d);
    const past =
      `${d.data}T${d.hora}` <
      `${u.localDate()}T${u.time(new Date().getHours() * 60 + new Date().getMinutes())}`;
    if (!options.importing && past && (!unchangedSlot || reactivated))
      e.data =
        "Novas consultas e remarcações precisam estar no presente ou futuro.";
    // O horário de um atendimento passado reflete a disponibilidade da época.
    const historical = original && unchangedSlot && past && !reactivated;
    // Consultas canceladas/faltas continuam no histórico e liberam o horário.
    if (u.active(d)) {
      const day = u.parseDate(d.data).getDay(),
        start = u.minutes(d.hora),
        end = start + Number(d.duracao);
      if (day < 1 || day > 5)
        e.data = "A clínica atende de segunda a sexta-feira.";
      if (start < 480 || end > 1080)
        e.hora = "A consulta inteira deve ocorrer entre 08:00 e 18:00.";
      if (!historical && !medico.diasAtendimento?.includes(day))
        e.medicoId = "O médico não atende neste dia da semana.";
      if (
        !historical &&
        (d.hora < medico.horaInicio || end > u.minutes(medico.horaFim))
      )
        e.hora = `O atendimento deve caber entre ${medico.horaInicio} e ${medico.horaFim}.`;
      for (const [field, label] of [
        ["medicoId", "O médico"],
        ["salaId", "A sala"],
        ["pacienteId", "O paciente"],
      ]) {
        const conflict = db.agendamentos.find(
          (a) =>
            a.id !== d.id &&
            u.active(a) &&
            a.data === d.data &&
            a[field] === d[field] &&
            start < u.minutes(a.hora) + Number(a.duracao || 30) &&
            end > u.minutes(a.hora),
        );
        if (conflict)
          e[field] =
            `${label} já possui uma consulta entre ${conflict.hora} e ${u.endTime(conflict)}.`;
      }
    }
    u.fail(e);
  },
  salvar(d, original) {
    const u = ClinicUtils;
    const row = {
      id: d.id || "",
      pacienteId: d.pacienteId,
      medicoId: d.medicoId,
      salaId: d.salaId,
      data: d.data,
      hora: d.hora,
      duracao: Number(d.duracao ?? 30),
      status: d.status || "agendada",
      secretariaId: d.secretariaId || "",
      observacoes: u.text(d.observacoes),
    };
    this.validar(row);
    return ClinicStore.save(
      "agendamentos",
      row,
      `consulta em ${u.date(row.data)} às ${row.hora}`,
      original,
    );
  },
  excluir(id) {
    return ClinicStore.remove("agendamentos", id);
  },
};
