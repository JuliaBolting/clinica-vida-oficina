/* Grupo 07 | Sprint 1 | Interface de Agendamentos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.agendamentos = ClinicParts.agendamentos || {};
ClinicParts.agendamentos.cadastroFront = {
  fields: [
    // TODO_OFICINA: reconstruir medicoId, data, hora, duracao conforme o PDF e o PO.
    {
      key: "pacienteId",
      label: "Paciente",
      type: "select",
      source: "pacientes",
      required: true,
      placeholder: "Selecione o paciente",
      wide: true,
    },
    {
      key: "salaId",
      label: "Sala",
      type: "select",
      source: "salas",
      required: true,
      placeholder: "Selecione a sala",
    },
    {
      key: "status",
      label: "Situação",
      type: "select",
      default: "agendada",
      options: [
        { value: "agendada", label: "Agendada" },
        { value: "confirmada", label: "Confirmada" },
        { value: "em_atendimento", label: "Em atendimento" },
        { value: "concluida", label: "Concluída" },
        { value: "cancelada", label: "Cancelada" },
        { value: "faltou", label: "Não compareceu" },
      ],
    },
    {
      key: "secretariaId",
      label: "Responsável pelo agendamento",
      type: "select",
      source: "secretarias",
      placeholder: "Não informado",
      wide: true,
    },
    {
      key: "observacoes",
      label: "Observações",
      type: "textarea",
      wide: true,
      placeholder: "Informações administrativas para o atendimento",
    },
  ],
};
