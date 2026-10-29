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
  get fields() { return ClinicParts.convenios.cadastroFront.fields; },
  get editFields() { return ClinicParts.convenios.manutencaoFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const back = d.id ? ClinicParts.convenios.manutencaoBack : ClinicParts.convenios.cadastroBack;
    return back.validar.call(this, d, db, options);
  },
  salvar(d, original) {
    return d.id
      ? ClinicParts.convenios.manutencaoBack.editar.call(this, d, original)
      : ClinicParts.convenios.cadastroBack.cadastrar.call(this, d, original);
  },
  excluir(id) { return ClinicParts.convenios.manutencaoBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.convenios.manutencaoFront.deletePreview(row, db); },
};
