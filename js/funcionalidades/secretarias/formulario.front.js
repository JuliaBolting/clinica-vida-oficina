/* Grupo 01 | Sprint 1 | Secretárias: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.secretarias = ClinicParts.secretarias || {};
ClinicParts.secretarias.formularioFront = {
  fields: [
    // TODO_OFICINA: reconstruir email, turno conforme o PDF e o P.O.
    {
      key: "nome",
      label: "Nome completo",
      required: true,
      placeholder: "Ex.: Ana Souza",
    },
    {
      key: "telefone",
      label: "Telefone",
      type: "tel",
      placeholder: "(49) 99999-0000",
    },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro, explicar os vínculos e pedir confirmação.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
