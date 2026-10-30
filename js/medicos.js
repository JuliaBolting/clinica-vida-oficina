/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.medicos = {
  title: "Médicos",
  singular: "médico",
  article: "o",
  icon: "doctor",
  description: "Conheça a equipe e organize os horários de atendimento.",
  columns: [
    { key: "nome", label: "Médico", type: "person", sub: "crm" },
    { key: "especialidade", label: "Especialidade", type: "tag" },
    { key: "dias", label: "Dias de atendimento" },
    { key: "horario", label: "Horário" },
  ],
  present(row, db) {
    return {
      ...row,
      especialidade:
        db.especialidades.find((e) => e.id === row.especialidadeId)?.nome ||
        "—",
      dias: ClinicUtils.weekdays(row.diasAtendimento),
      horario: `${row.horaInicio}–${row.horaFim}`,
    };
  },
  get fields() { return ClinicParts.medicos.formularioFront.fields; },
  get editFields() { return ClinicParts.medicos.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.medicos.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.medicos.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.medicos.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.medicos.formularioFront.deletePreview(row, db); },
};
