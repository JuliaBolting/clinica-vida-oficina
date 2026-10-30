/* Grupo 03 | Sprint 2 | Médicos: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.medicos = ClinicParts.medicos || {};
ClinicParts.medicos.formularioFront = {
  fields: [
    // TODO_OFICINA: reconstruir especialidadeId, diasAtendimento conforme o PDF e o P.O.
    {
      key: "nome",
      label: "Nome completo",
      required: true,
      placeholder: "Ex.: Dra. Marina Costa",
      wide: true,
    },
    {
      key: "crm",
      label: "CRM / UF",
      required: true,
      placeholder: "Ex.: CRM/SC 12345",
    },
    {
      key: "horaInicio",
      label: "Início do atendimento",
      type: "time",
      required: true,
      default: "08:00",
    },
    {
      key: "horaFim",
      label: "Fim do atendimento",
      type: "time",
      required: true,
      default: "18:00",
    },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro, explicar os vínculos e pedir confirmação.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
