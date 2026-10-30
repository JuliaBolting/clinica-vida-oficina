/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.agendamentos = {
  title: "Agendamentos",
  singular: "consulta",
  article: "a",
  icon: "calendar",
  description: "Cada horário bem organizado é mais tempo para cuidar.",
  statuses: {
    agendada: { label: "Agendada", tone: "blue" },
    confirmada: { label: "Confirmada", tone: "green" },
    em_atendimento: { label: "Em atendimento", tone: "purple" },
    concluida: { label: "Concluída", tone: "neutral" },
    cancelada: { label: "Cancelada", tone: "red" },
    faltou: { label: "Não compareceu", tone: "amber" },
  },
  columns: [
    {
      key: "paciente",
      label: "Paciente",
      type: "person",
      sub: "especialidade",
    },
    { key: "dataLabel", label: "Data e horário", sub: "intervalo" },
    { key: "medico", label: "Médico", sub: "sala" },
    { key: "status", label: "Situação", type: "status" },
  ],
  present(row, db) {
    const u = ClinicUtils,
      m = db.medicos.find((m) => m.id === row.medicoId);
    return {
      ...row,
      paciente: db.pacientes.find((p) => p.id === row.pacienteId)?.nome || "—",
      medico: m?.nome || "—",
      especialidade:
        db.especialidades.find((e) => e.id === m?.especialidadeId)?.nome || "—",
      sala: db.salas.find((s) => s.id === row.salaId)?.nome || "—",
      dataLabel: u.date(row.data, { year: "numeric" }),
      intervalo: `${row.hora}–${u.endTime(row)} · ${row.duracao || 30} min`,
      status: row.status || "agendada",
    };
  },
  horariosDisponiveis(d, db = ClinicStore.snapshot()) {
    const slots = [];
    for (let n = 480; n < 1080; n += 15) {
      const candidate = {
        ...d,
        hora: ClinicUtils.time(n),
        status: "agendada",
        duracao: Number(d.duracao ?? 30),
      };
      try {
        this.validar(candidate, db);
        slots.push(candidate.hora);
      } catch (_) {}
    }
    return slots;
  },
  get fields() { return ClinicParts.agendamentos.formularioFront.fields; },
  get editFields() { return ClinicParts.agendamentos.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.agendamentos.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.agendamentos.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.agendamentos.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.agendamentos.formularioFront.deletePreview(row, db); },
};
