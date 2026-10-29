/* Grupo 03 | Sprint 1 | Interface de Convênios. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.convenios = ClinicParts.convenios || {};
ClinicParts.convenios.cadastroFront = {
  fields: [
    // TODO_OFICINA: reconstruir codigo, telefone conforme o PDF e o PO.
    {
      key: "nome",
      label: "Nome do convênio",
      required: true,
      placeholder: "Ex.: Saúde Mais",
    },
    { key: "observacoes", label: "Observações", type: "textarea", wide: true },
  ],
};
