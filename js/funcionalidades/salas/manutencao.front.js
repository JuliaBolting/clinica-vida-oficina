/* Grupo 06 | Sprint 2 | Interface de Salas. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.salas = ClinicParts.salas || {};
ClinicParts.salas.manutencaoFront = {
  fields: [
    // TODO_OFICINA: reconstruir nome, sigla conforme o PDF e o PO.
    {
      key: "localizacao",
      label: "Localização",
      placeholder: "Ex.: Térreo, ala A",
    },
    {
      key: "observacoes",
      label: "Observações",
      type: "textarea",
      placeholder: "Recursos e informações sobre o espaço",
      wide: true,
    },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro e explicar o impacto da exclusão, conforme o PO.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
