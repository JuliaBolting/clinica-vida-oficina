/* Grupo 01 | Sprint 1 | Interface de Secretárias. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.secretarias = ClinicParts.secretarias || {};
ClinicParts.secretarias.cadastroFront = {
  fields: [
    // TODO_OFICINA: reconstruir email, turno conforme o PDF e o PO.
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
};
