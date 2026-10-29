/* Grupo 01 | Sprint 2 | Interface de Médicos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.medicos = ClinicParts.medicos || {};
ClinicParts.medicos.manutencaoFront = {
  fields: [
    // TODO_OFICINA: reconstruir horaInicio, horaFim conforme o PDF e o PO.
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
      key: "especialidadeId",
      label: "Especialidade",
      type: "select",
      source: "especialidades",
      required: true,
      placeholder: "Selecione uma especialidade",
    },
    {
      key: "diasAtendimento",
      label: "Dias de atendimento",
      type: "weekdays",
      required: true,
      wide: true,
    },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro e explicar o impacto da exclusão, conforme o PO.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
