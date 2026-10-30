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
  get fields() { return ClinicParts.secretarias.formularioFront.fields; },
  get editFields() { return ClinicParts.secretarias.formularioFront.fields; },
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    return ClinicParts.secretarias.crudBack.validar.call(this, d, db, options);
  },
  salvar(d, original) { return ClinicParts.secretarias.crudBack.salvar.call(this, d, original); },
  excluir(id) { return ClinicParts.secretarias.crudBack.excluir.call(this, id); },
  deletePreview(row, db) { return ClinicParts.secretarias.formularioFront.deletePreview(row, db); },
};
