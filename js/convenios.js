/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.convenios = {
  title: "Convênios",
  singular: "convênio",
  article: "o",
  icon: "shield",
  description: "Mais possibilidades de acesso ao cuidado.",
  columns: [
    { key: "nome", label: "Convênio", type: "person", sub: "codigo" },
    { key: "telefone", label: "Contato" },
    { key: "pacientes", label: "Pacientes vinculados", type: "tag" },
  ],
  present(row, db) {
    return {
      ...row,
      telefone: ClinicUtils.phoneFormat(row.telefone) || "Não informado",
      pacientes: db.pacientes.filter((p) => p.convenioId === row.id).length,
    };
  },
  get fields() { return ClinicParts.convenios.formularioFront.fields; },
  get editFields() { return ClinicParts.convenios.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.convenios.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.convenios.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.convenios.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.convenios.formularioFront.deletePreview(row, db); },
};
