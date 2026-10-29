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
  get fields() { return ClinicParts.salas.cadastroFront.fields; },
  get editFields() { return ClinicParts.salas.manutencaoFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const back = d.id ? ClinicParts.salas.manutencaoBack : ClinicParts.salas.cadastroBack;
    return back.validar.call(this, d, db, options);
  },
  salvar(d, original) {
    return d.id
      ? ClinicParts.salas.manutencaoBack.editar.call(this, d, original)
      : ClinicParts.salas.cadastroBack.cadastrar.call(this, d, original);
  },
  excluir(id) { return ClinicParts.salas.manutencaoBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.salas.manutencaoFront.deletePreview(row, db); },
};
