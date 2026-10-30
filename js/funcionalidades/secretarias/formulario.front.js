/* Grupo 01 | Sprint 1 | Secretárias: cadastro, edição e exclusão. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.secretarias = ClinicParts.secretarias || {};
ClinicParts.secretarias.formularioFront = {
  fields: [
    // TODO_OFICINA: reconstruir email, turno conforme o PDF e o P.O.
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
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "exemplo@dominio.com",
    },
    { 
      key: 'turno', 
      label: 'Turno', 
      type: 'select', 
      required: true, 
      options: [
        { label: 'Manhã', value: 'Manhã' },
        { label: 'Tarde', value: 'Tarde' },
        { label: 'Integral', value: 'Integral' }
      ],
      placeholder: 'Selecione o turno' 
    }
  ],
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro, explicar os vínculos e pedir confirmação.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
