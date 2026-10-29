/* Grupo 05 | Sprint 1 | Interface de Médicos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.medicos = ClinicParts.medicos || {};
ClinicParts.medicos.cadastroFront = {
  fields: [
    // TODO_OFICINA: reconstruir especialidadeId, diasAtendimento conforme o PDF e o PO.
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
};
