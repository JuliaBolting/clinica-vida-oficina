/* Grupo 04 | Sprint 2 | Interface de Convênios. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.convenios = ClinicParts.convenios || {};
ClinicParts.convenios.manutencaoFront = {
  fields: [
    // TODO_OFICINA: reconstruir nome, codigo conforme o PDF e o PO.
    {
      key: "telefone",
      label: "Telefone de contato",
      type: "tel",
      placeholder: "(49) 3333-0000",
    },
    { key: "observacoes", label: "Observações", type: "textarea", wide: true },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro e explicar o impacto da exclusão, conforme o PO.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
