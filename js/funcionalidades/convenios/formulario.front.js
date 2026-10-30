/* Grupo 02 | Sprint 2 | Convênios: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.convenios = ClinicParts.convenios || {};
ClinicParts.convenios.formularioFront = {
  fields: [
    // TODO_OFICINA: reconstruir codigo, telefone conforme o PDF e o P.O.
    {
      key: "nome",
      label: "Nome do convênio",
      required: true,
      placeholder: "Ex.: Saúde Mais",
    },
    { key: "observacoes", label: "Observações", type: "textarea", wide: true },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro, explicar os vínculos e pedir confirmação.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
