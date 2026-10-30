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
  get fields() { return ClinicParts.especialidades.formularioFront.fields; },
  get editFields() { return ClinicParts.especialidades.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.especialidades.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.especialidades.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.especialidades.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.especialidades.formularioFront.deletePreview(row, db); },
};
