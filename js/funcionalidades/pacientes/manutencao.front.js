/* Grupo 03 | Sprint 2 | Interface de Pacientes. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.pacientes = ClinicParts.pacientes || {};
ClinicParts.pacientes.manutencaoFront = {
  fields: [
    // TODO_OFICINA: reconstruir nome, telefone conforme o PDF e o PO.
    {
      key: "cpf",
      label: "CPF",
      required: true,
      placeholder: "000.000.000-00",
      mask: "cpf",
      max: 14,
    },
    { key: "nascimento", label: "Data de nascimento", type: "date" },
    {
      key: "convenioId",
      label: "Convênio",
      type: "select",
      source: "convenios",
      placeholder: "Particular (sem convênio)",
    },
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
    // TODO_OFICINA: identificar o registro e explicar o impacto da exclusão, conforme o PO.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
