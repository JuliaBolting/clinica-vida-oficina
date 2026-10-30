/* Grupo 02 | Sprint 1 | Salas: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.salas = ClinicParts.salas || {};
ClinicParts.salas.formularioFront = {
  fields: [
    // TODO_OFICINA: reconstruir sigla, localizacao conforme o PDF e o P.O.
    {
      key: "nome",
      label: "Nome da sala",
      required: true,
      placeholder: "Ex.: Consultório Horizonte",
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
    // TODO_OFICINA: identificar o registro, explicar os vínculos e pedir confirmação.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
