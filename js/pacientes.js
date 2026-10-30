/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.pacientes = {
  title: "Pacientes",
  singular: "paciente",
  article: "o",
  icon: "users",
  description: "Pessoas no centro. Informações sempre à mão.",
  columns: [
    { key: "nome", label: "Paciente", type: "person", sub: "email" },
    { key: "cpf", label: "CPF" },
    { key: "telefone", label: "Contato" },
    { key: "convenio", label: "Convênio", type: "tag" },
  ],
  present(row, db) {
    return {
      ...row,
      cpf: ClinicUtils.cpfFormat(row.cpf),
      telefone: ClinicUtils.phoneFormat(row.telefone),
      email: row.email || "Paciente cadastrado",
      convenio:
        db.convenios.find((c) => c.id === row.convenioId)?.nome || "Particular",
    };
  },
  get fields() { return ClinicParts.pacientes.formularioFront.fields; },
  get editFields() { return ClinicParts.pacientes.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.pacientes.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.pacientes.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.pacientes.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.pacientes.formularioFront.deletePreview(row, db); },
};
