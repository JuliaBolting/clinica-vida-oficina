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
  get fields() { return ClinicParts.pacientes.cadastroFront.fields; },
  get editFields() { return ClinicParts.pacientes.manutencaoFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const back = d.id ? ClinicParts.pacientes.manutencaoBack : ClinicParts.pacientes.cadastroBack;
    return back.validar.call(this, d, db, options);
  },
  salvar(d, original) {
    return d.id
      ? ClinicParts.pacientes.manutencaoBack.editar.call(this, d, original)
      : ClinicParts.pacientes.cadastroBack.cadastrar.call(this, d, original);
  },
  excluir(id) { return ClinicParts.pacientes.manutencaoBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.pacientes.manutencaoFront.deletePreview(row, db); },
};
