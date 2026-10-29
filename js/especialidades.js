/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.especialidades = {
  title: "Especialidades",
  singular: "especialidade",
  article: "a",
  icon: "specialty",
  description: "Diferentes especialidades. O mesmo compromisso com o cuidado.",
  columns: [
    { key: "nome", label: "Especialidade", type: "person", sub: "descricao" },
    { key: "medicos", label: "Médicos vinculados", type: "tag" },
  ],
  present(row, db) {
    return {
      ...row,
      descricao: row.descricao || "Especialidade médica",
      medicos: db.medicos.filter((m) => m.especialidadeId === row.id).length,
    };
  },
  get fields() { return ClinicParts.especialidades.cadastroFront.fields; },
  get editFields() { return ClinicParts.especialidades.manutencaoFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const back = d.id ? ClinicParts.especialidades.manutencaoBack : ClinicParts.especialidades.cadastroBack;
    return back.validar.call(this, d, db, options);
  },
  salvar(d, original) {
    return d.id
      ? ClinicParts.especialidades.manutencaoBack.editar.call(this, d, original)
      : ClinicParts.especialidades.cadastroBack.cadastrar.call(this, d, original);
  },
  excluir(id) { return ClinicParts.especialidades.manutencaoBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.especialidades.manutencaoFront.deletePreview(row, db); },
};
