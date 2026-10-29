/* Grupo 05 | Sprint 1 | Regras e dados de Médicos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.medicos = ClinicParts.medicos || {};
ClinicParts.medicos.cadastroBack = {
  validar(d, db = ClinicStore.snapshot()) {
    const u = ClinicUtils,
      e = {};
    u.requiredName(d.nome, e);
    // TODO_OFICINA: completar a regra de CRM acordada com o PO.
    throw new ClinicError("OFICINA_PENDENTE: grupo 05, validar CRM.");
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
    u.fail(e);
  },
  cadastrar(d, original) {
    // TODO_OFICINA: implementar conforme a Sprint 1, validar e testar antes de retirar o bloqueio.
    throw new ClinicError("OFICINA_PENDENTE: grupo 05, sprint 1, completar cadastrar.");
  },
};
