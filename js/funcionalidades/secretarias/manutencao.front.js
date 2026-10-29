/* Grupo 05 | Sprint 2 | Interface de Secretárias. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.secretarias = ClinicParts.secretarias || {};
ClinicParts.secretarias.manutencaoFront = {
  fields: [
    // TODO_OFICINA: reconstruir nome, telefone conforme o PDF e o PO.
    {
      key: "email",
      label: "E-mail",
      type: "email",
      required: true,
      placeholder: "ana@exemplo.com",
    },
    {
      key: "turno",
      label: "Turno",
      type: "select",
      default: "Integral",
      options: ["Integral", "Manhã", "Tarde"],
    },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro e explicar o impacto da exclusão, conforme o PO.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
