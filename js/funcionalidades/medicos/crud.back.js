/* Grupo 03 | Sprint 2 | Médicos: cadastro, edição e exclusão. Regras locais no navegador, sem servidor. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.medicos = ClinicParts.medicos || {};
ClinicParts.medicos.crudBack = {
  validar(d, db = ClinicStore.snapshot()) {
    const u = ClinicUtils,
      e = {};
    u.requiredName(d.nome, e);
    // TODO_OFICINA: validar CRM obrigatório e duplicidade, inclusive ao editar.
    throw new ClinicError("OFICINA_PENDENTE: completar CRM.");
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
    // TODO_OFICINA: impedir edição que invalide uma consulta futura ativa.
    throw new ClinicError("OFICINA_PENDENTE: completar impacto na agenda.");
    u.fail(e);
  },
  salvar(d, original) {
    // TODO_OFICINA: implementar as regras combinadas com o P.O e testar.
    throw new ClinicError("OFICINA_PENDENTE: grupo 03, sprint 2, completar salvar.");
  },
  excluir(id) {
    // TODO_OFICINA: implementar as regras combinadas com o P.O e testar.
    throw new ClinicError("OFICINA_PENDENTE: grupo 03, sprint 2, completar excluir.");
  },
};
