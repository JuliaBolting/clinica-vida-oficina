/* Grupo 02 | Sprint 2 | Interface de Agendamentos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.agendamentos = ClinicParts.agendamentos || {};
ClinicParts.agendamentos.manutencaoFront = {
  fields: [
    // TODO_OFICINA: reconstruir data, hora, status conforme o PDF e o PO.
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
      key: "medicoId",
      label: "Médico",
      type: "select",
      source: "medicos",
      required: true,
      placeholder: "Selecione o médico",
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
      key: "duracao",
      label: "Duração",
      type: "number",
      required: true,
      default: 30,
      options: [15, 30, 45, 60, 90, 120],
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
  deletePreview(row, db) {
    // TODO_OFICINA: identificar o registro e explicar o impacto da exclusão, conforme o PO.
    return "Confirmação de exclusão em desenvolvimento.";
  },
};
