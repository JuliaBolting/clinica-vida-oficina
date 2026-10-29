/* Grupo 04 | Sprint 1 | Interface de Pacientes. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.pacientes = ClinicParts.pacientes || {};
ClinicParts.pacientes.cadastroFront = {
  fields: [
    // TODO_OFICINA: reconstruir cpf, convenioId conforme o PDF e o PO.
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
};
