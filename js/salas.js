/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.salas = {
  title: "Salas",
  singular: "sala",
  article: "a",
  icon: "room",
  description: "Um espaço preparado para cada atendimento.",
  columns: [
    { key: "nome", label: "Sala", type: "person", sub: "localizacao" },
    { key: "sigla", label: "Identificação", type: "tag" },
    { key: "consultas", label: "Consultas vinculadas" },
  ],
  present(row, db) {
    return {
      ...row,
      localizacao: row.localizacao || "Localização não informada",
      consultas: db.agendamentos.filter((a) => a.salaId === row.id).length,
    };
  },
  get fields() { return ClinicParts.salas.formularioFront.fields; },
  get editFields() { return ClinicParts.salas.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.salas.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.salas.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.salas.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.salas.formularioFront.deletePreview(row, db); },
};
