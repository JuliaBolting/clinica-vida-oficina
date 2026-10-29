/* Grupo 02 | Sprint 1 | Interface de Salas. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.salas = ClinicParts.salas || {};
ClinicParts.salas.cadastroFront = {
  fields: [
    // TODO_OFICINA: reconstruir sigla, localizacao conforme o PDF e o PO.
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
};
