/* Grupo 01 | Sprint 1 | Secretárias: cadastro, edição e exclusão. Regras locais no navegador, sem servidor. */
window.ClinicParts = window.ClinicParts || {};
ClinicParts.secretarias = ClinicParts.secretarias || {};
const SECRETARIA_TURNOS = ["Manhã", "Tarde", "Integral"];
// Aceita "manha", "MANHÃ", " Manhã " etc. e devolve a grafia padrão ("" se inválido).
const secretariaTurno = (value) =>
  SECRETARIA_TURNOS.find(
    (t) => ClinicUtils.normalize(t) === ClinicUtils.normalize(value),
  ) || "";
ClinicParts.secretarias.crudBack = {
  validar(d, db = ClinicStore.snapshot(), options = {}) {
    const u = ClinicUtils,
      e = {};
    // Com ID é edição: o registro precisa existir. Sem ID, o ClinicStore gera um novo.
    if (d.id && !u.reference(db, "secretarias", d.id))
      throw new ClinicError("Secretária não encontrada. Reabra a lista.");
    u.requiredName(d.nome, e);
    if (d.telefone && ![10, 11].includes(u.digits(d.telefone).length))
      e.telefone = "Informe um telefone com DDD.";
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
      e.email = "Informe um e-mail válido.";
    else if (d.email && u.unique(db, "secretarias", "email", d.email, d.id))
      e.email = "Já existe uma secretária com este e-mail.";
    if (u.text(d.turno) && !secretariaTurno(d.turno))
      e.turno = `Escolha um turno: ${SECRETARIA_TURNOS.join(", ")}.`;
    // E-mail e turno ainda não aparecem no formulário: o motivo vai na mensagem geral.
    if (Object.keys(e).length)
      throw new ClinicError(
        `Confira os campos destacados: ${Object.values(e).join(" ")}`,
        e,
      );
  },
  salvar(d, original) {
    const u = ClinicUtils;
    // Campos que o formulário não envia mantêm o valor já salvo.
    const row = {
      id: d.id || "",
      nome: u.text(d.nome),
      email: u.text(d.email ?? original?.email).toLowerCase(),
      telefone: u.digits(d.telefone),
      turno: u.text(d.turno ?? original?.turno),
    };
    if (secretariaTurno(row.turno)) row.turno = secretariaTurno(row.turno);
    this.validar(row);
    return ClinicStore.save("secretarias", row, row.nome, original);
  },
  excluir(id) {
    return ClinicStore.remove("secretarias", id, (db) => {
      if (db.agendamentos.some((a) => a.secretariaId === id))
        throw new ClinicError("Esta secretária está vinculada a consultas.");
    });
  },
};
