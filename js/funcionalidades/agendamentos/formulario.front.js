/* Exemplo completo | Agendamentos. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.agendamentos = ClinicParts.agendamentos || {};
ClinicParts.agendamentos.formularioFront = {
  fields: [
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
    { key: "data", label: "Data da consulta", type: "date", required: true },
    { key: "hora", label: "Horário", type: "time", required: true },
    {
      key: "duracao",
      label: "Duração",
      type: "number",
      required: true,
      default: 30,
      options: [15, 30, 45, 60, 90, 120],
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
  deletePreview(row, db) {
    return `A consulta de ${ClinicUtils.date(row.data)} às ${row.hora} será removida permanentemente. Para preservar o histórico e liberar o horário, use Cancelar.`;
  },
};
