/* Grupo 01 | Sprint 2 | Pacientes: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.pacientes = ClinicParts.pacientes || {};
ClinicParts.pacientes.formularioFront = {
  fields: [
    // TODO_OFICINA: reconstruir cpf, convenioId conforme o PDF e o P.O.
    {
      key: "nome",
      label: "Nome completo",
      required: true,
      placeholder: "Ex.: Camila Almeida",
      wide: true,
    },
    {
      key: "telefone",
      label: "Telefone",
      type: "tel",
      required: true,
      placeholder: "(49) 99999-0000",
      mask: "phone",
      max: 16,
    },
    { key: "nascimento", label: "Data de nascimento", type: "date" },
    {
      key: "email",
      label: "E-mail",
      type: "email",
      wide: true,
      placeholder: "paciente@exemplo.com",
    },
    {
      key: "observacoes",
      label: "Observações administrativas",
      type: "textarea",
      wide: true,
      helper: "Use dados fictícios neste projeto educacional.",
    },
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro, explicar os vínculos e pedir confirmação.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
