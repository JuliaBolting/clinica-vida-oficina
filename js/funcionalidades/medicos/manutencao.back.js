/* Grupo 01 | Sprint 2 | Regras e dados de Médicos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.medicos = ClinicParts.medicos || {};
ClinicParts.medicos.manutencaoBack = {
  validar(d, db = ClinicStore.snapshot()) {
    const u = ClinicUtils,
      e = {};
    u.requiredName(d.nome, e);
    // TODO_OFICINA: completar a regra de CRM acordada com o PO.
    throw new ClinicError("OFICINA_PENDENTE: grupo 01, validar CRM.");
    if (!u.reference(db, "especialidades", d.especialidadeId))
      e.especialidadeId = "Selecione uma especialidade cadastrada.";
    if (
      !Array.isArray(d.diasAtendimento) ||
      !d.diasAtendimento.length ||
      d.diasAtendimento.some((n) => ![1, 2, 3, 4, 5].includes(n)) ||
      new Set(d.diasAtendimento).size !== d.diasAtendimento.length
    )
      e.diasAtendimento = "Selecione pelo menos um dia útil, sem repetições.";
    if (
      !Number.isFinite(u.minutes(d.horaInicio)) ||
      d.horaInicio < "08:00" ||
      d.horaInicio >= "18:00"
    )
      e.horaInicio = "Use um horário entre 08:00 e 17:59.";
    if (
      !Number.isFinite(u.minutes(d.horaFim)) ||
      d.horaFim <= "08:00" ||
      d.horaFim > "18:00" ||
      d.horaFim <= d.horaInicio
    )
      e.horaFim = "O fim deve ser após o início e até 18:00.";
    // TODO_OFICINA: conferir impacto na agenda futura ao editar.
    throw new ClinicError("OFICINA_PENDENTE: completar disponibilidade futura.");
    u.fail(e);
  },
  editar(d, original) {
    // TODO_OFICINA: implementar conforme a Sprint 2, validar e testar antes de retirar o bloqueio.
    throw new ClinicError("OFICINA_PENDENTE: grupo 01, sprint 2, completar editar.");
  },
  excluir(id) {
    // TODO_OFICINA: implementar conforme a Sprint 2, validar e testar antes de retirar o bloqueio.
    throw new ClinicError("OFICINA_PENDENTE: grupo 01, sprint 2, completar excluir.");
  },
};
