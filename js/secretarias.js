/* Conexão compartilhada. Não editar nas equipes. */
ClinicModules.secretarias = {
  title: "Secretárias",
  singular: "secretária",
  article: "a",
  icon: "headset",
  description: "Quem recebe, organiza e faz o cuidado acontecer.",
  columns: [
    { key: "nome", label: "Profissional", type: "person", sub: "email" },
    { key: "telefone", label: "Contato" },
    { key: "turno", label: "Turno", type: "tag" },
  ],
  present(row) {
    return {
      ...row,
      telefone: ClinicUtils.phoneFormat(row.telefone) || "Não informado",
    };
  },
  get fields() { return ClinicParts.secretarias.cadastroFront.fields; },
  get editFields() { return ClinicParts.secretarias.manutencaoFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const back = d.id ? ClinicParts.secretarias.manutencaoBack : ClinicParts.secretarias.cadastroBack;
    return back.validar.call(this, d, db, options);
  },
  salvar(d, original) {
    return d.id
      ? ClinicParts.secretarias.manutencaoBack.editar.call(this, d, original)
      : ClinicParts.secretarias.cadastroBack.cadastrar.call(this, d, original);
  },
  excluir(id) { return ClinicParts.secretarias.manutencaoBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.secretarias.manutencaoFront.deletePreview(row, db); },
};
