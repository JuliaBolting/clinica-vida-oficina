/* Infraestrutura compartilhada. As regras dos sete grupos ficam nos módulos. */
window.ClinicModules = {};
window.ClinicError = class ClinicError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = "ClinicError";
    this.fields = fields;
  }
};
window.ClinicUtils = (() => {
  const text = (value) => String(value ?? "").trim();
  const normalize = (value) =>
    text(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const digits = (value) => text(value).replace(/\D/g, "");
  const escape = (value) =>
    text(value).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const localDate = (date = new Date()) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const parseDate = (value) => new Date(`${value}T12:00:00`);
  const validDate = (value) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !isNaN(parseDate(value)) &&
    localDate(parseDate(value)) === value;
  const minutes = (value) =>
    /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
      ? Number(value.slice(0, 2)) * 60 + Number(value.slice(3))
      : NaN;
  const time = (value) =>
    `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  const endTime = (row) => time(minutes(row.hora) + Number(row.duracao || 30));
  const active = (row) => !["cancelada", "faltou"].includes(row.status);
  const future = (row) =>
    `${row.data}T${row.hora}` >=
    `${localDate()}T${time(new Date().getHours() * 60 + new Date().getMinutes())}`;
  const date = (value, opts = {}) =>
    validDate(value)
      ? parseDate(value).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          ...opts,
        })
      : "—";
  const unique = (db, entity, field, value, id = "", normalizer = normalize) =>
    db[entity].some(
      (row) => row.id !== id && normalizer(row[field]) === normalizer(value),
    );
  const reference = (db, entity, id) => db[entity].some((row) => row.id === id);
  const fail = (errors) => {
    if (Object.keys(errors).length)
      throw new ClinicError("Confira os campos destacados.", errors);
  };
  const requiredName = (value, errors, key = "nome") => {
    if (text(value).length < 3)
      errors[key] = "Informe pelo menos 3 caracteres.";
    if (text(value).length > 120) errors[key] = "Use até 120 caracteres.";
  };
  const cpfValid = (value) => {
    const cpf = digits(value);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    for (let n = 9; n <= 10; n++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += Number(cpf[i]) * (n + 1 - i);
      const d = (sum * 10) % 11;
      if ((d === 10 ? 0 : d) !== Number(cpf[n])) return false;
    }
    return true;
  };
  const cpfFormat = (value) =>
    digits(value)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  const phoneFormat = (value) => {
    const s = digits(value).slice(0, 11);
    return s.length > 10
      ? s.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : s.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };
  const initials = (value) =>
    text(value)
      .replace(/^(Dr\.?|Dra\.?)\s+/i, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((v) => v[0])
      .join("")
      .toUpperCase() || "CV";
  const weekdays = (days) =>
    (days || [])
      .map((d) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d])
      .join(" · ");
  const addDays = (value, count) => {
    const d = parseDate(value);
    d.setDate(d.getDate() + count);
    return localDate(d);
  };
  const monday = (value) => {
    const d = parseDate(value);
    return addDays(value, -(d.getDay() || 7) + 1);
  };
  const uid = () =>
    globalThis.crypto?.randomUUID?.() ||
    `cv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const compare = (a, b) =>
    String(a).localeCompare(String(b), "pt-BR", {
      numeric: true,
      sensitivity: "base",
    });
  return {
    text,
    normalize,
    digits,
    escape,
    localDate,
    parseDate,
    validDate,
    minutes,
    time,
    endTime,
    active,
    future,
    date,
    unique,
    reference,
    fail,
    requiredName,
    cpfValid,
    cpfFormat,
    phoneFormat,
    initials,
    weekdays,
    addDays,
    monday,
    uid,
    compare,
  };
})();
window.ClinicStore = (() => {
  const namespace = window.ClinicConfig?.storageNamespace || "principal";
  const KEY =
    namespace === "principal"
      ? "clinica_vida_v2"
      : `clinica_vida_v2_${namespace}`;
  const entities = [
    "secretarias",
    "salas",
    "convenios",
    "pacientes",
    "medicos",
    "especialidades",
    "agendamentos",
  ];
  const empty = () => ({
    version: 2,
    revision: 0,
    updatedAt: null,
    ...Object.fromEntries(entities.map((k) => [k, []])),
    activity: [],
  });
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = empty(),
    writable = true,
    loadError = "",
    fresh = false,
    migrated = false;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.version !== 2 || entities.some((k) => !Array.isArray(data[k])))
        throw Error("Formato de dados local não reconhecido.");
      state = { ...empty(), ...data };
    } else {
      const legacy = entities.map((k) =>
        namespace === "principal" ? localStorage.getItem(`clinica_${k}`) : null,
      );
      if (legacy.some((v) => v !== null)) {
        legacy.forEach((raw, i) => {
          if (raw) {
            const rows = JSON.parse(raw);
            if (!Array.isArray(rows)) throw Error("Dados antigos inválidos.");
            state[entities[i]] = rows;
          }
        });
        state.agendamentos = state.agendamentos.map((row) => ({
          duracao: 30,
          status: "agendada",
          secretariaId: "",
          observacoes: "",
          ...row,
        }));
        migrated = true;
      } else fresh = true;
    }
    const probe = `${KEY}_probe`;
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
  } catch (err) {
    writable = false;
    loadError =
      "Não foi possível abrir o armazenamento local. Nenhum dado foi sobrescrito. Exporte os dados acessíveis e permita o armazenamento do navegador, ou abra o projeto pelo Live Server.";
  }
  const snapshot = () => clone(state);
  const readLatest = () => {
    if (!writable)
      throw new ClinicError(
        "O armazenamento está indisponível. Habilite-o antes de salvar.",
      );
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const db = JSON.parse(raw);
        if (db.version !== 2 || entities.some((k) => !Array.isArray(db[k])))
          throw Error();
        return db;
      }
      return state;
    } catch (_) {
      throw new ClinicError(
        "Não foi possível ler os dados. Recarregue a página antes de continuar.",
      );
    }
  };
  const commit = (mutate) => {
    const next = clone(readLatest());
    mutate(next);
    next.revision = (next.revision || 0) + 1;
    next.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (_) {
      throw new ClinicError(
        "Não foi possível salvar: armazenamento cheio ou bloqueado. Exporte um backup antes de liberar espaço.",
      );
    }
    state = next;
    window.dispatchEvent(new CustomEvent("clinic:changed"));
    return snapshot();
  };
  const log = (db, message) => {
    db.activity = [
      { id: ClinicUtils.uid(), message, at: new Date().toISOString() },
      ...(db.activity || []),
    ].slice(0, 80);
  };
  const save = (entity, record, label, expectedRecord) => {
    let saved;
    commit((db) => {
      const current = db[entity].find((r) => r.id === record.id);
      if (
        expectedRecord &&
        JSON.stringify(current) !== JSON.stringify(expectedRecord)
      )
        throw new ClinicError(
          "Este registro foi alterado em outra aba. Feche o formulário e abra-o novamente.",
        );
      // Valida novamente sobre a cópia mais recente, evitando duplicatas entre abas.
      ClinicModules[entity].validar(record, db);
      if (record.id && !current)
        throw new ClinicError("Este registro já foi excluído. Reabra a lista.");
      saved = { ...record, id: record.id || ClinicUtils.uid() };
      if (current)
        db[entity] = db[entity].map((row) =>
          row.id === saved.id ? saved : row,
        );
      else db[entity].push(saved);
      log(
        db,
        `${current ? "Atualizado" : "Cadastrado"}: ${label || saved.nome || saved.id}`,
      );
    });
    return clone(saved);
  };
  const remove = (entity, id, guard) =>
    commit((db) => {
      const row = db[entity].find((r) => r.id === id);
      if (!row) throw new ClinicError("Registro não encontrado.");
      guard?.(db);
      db[entity] = db[entity].filter((r) => r.id !== id);
      log(
        db,
        `Excluído: ${row.nome || "consulta em " + ClinicUtils.date(row.data)}`,
      );
    });
  const validateBackup = (raw) => {
    if (!raw || typeof raw !== "object" || raw.version !== 2)
      throw new ClinicError(
        "Arquivo incompatível. Use um backup JSON exportado pela Clínica Vida (versão 2).",
      );
    const db = empty();
    for (const key of entities) {
      if (!Array.isArray(raw[key]) || raw[key].length > 10000)
        throw new ClinicError(`Lista de ${key} inválida ou muito grande.`);
      const ids = new Set();
      db[key] = raw[key].map((row) => {
        if (
          !row ||
          typeof row !== "object" ||
          typeof row.id !== "string" ||
          !/^[a-zA-Z0-9_-]{1,90}$/.test(row.id) ||
          ids.has(row.id)
        )
          throw new ClinicError(
            `Identificador inválido ou repetido em ${key}.`,
          );
        ids.add(row.id);
        const clean = { id: row.id };
        for (const f of ClinicModules[key].fields) {
          let v = row[f.key] ?? f.default ?? (f.type === "weekdays" ? [] : "");
          if (f.type === "weekdays") {
            if (!Array.isArray(v) || v.some((n) => !Number.isInteger(n)))
              throw new ClinicError("Dias de atendimento inválidos.");
            clean[f.key] = v;
          } else if (f.type === "number") clean[f.key] = Number(v);
          else {
            if (typeof v !== "string" || v.length > 2000)
              throw new ClinicError("Campo de texto inválido no backup.");
            clean[f.key] = v;
          }
        }
        return clean;
      });
    }
    for (const key of entities)
      for (const row of db[key]) {
        try {
          ClinicModules[key].validar(row, db, { importing: true });
        } catch (err) {
          throw new ClinicError(
            `Backup inválido em ${ClinicModules[key].title} (${row.nome || row.data || row.id}): ${Object.values(err.fields || {}).join(" ") || err.message}`,
          );
        }
      }
    // Log importado não é executado nem copiado; somente texto produzido pelo sistema.
    return db;
  };
  const replace = (db, message) =>
    commit((next) => {
      entities.forEach((k) => {
        next[k] = clone(db[k]);
      });
      next.activity = [];
      log(next, message);
    });
  const initialize = (demo) => {
    if (writable && (fresh || migrated)) {
      try {
        if (fresh) replace(demo, "Ambiente de demonstração preparado.");
        else
          commit((db) =>
            log(db, "Dados da versão anterior preservados e migrados."),
          );
      } catch (err) {
        writable = false;
        loadError = err.message;
      }
    }
  };
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) {
      try {
        const raw = event.newValue;
        const db = raw ? JSON.parse(raw) : empty();
        if (db.version !== 2 || entities.some((k) => !Array.isArray(db[k])))
          return;
        state = db;
        window.dispatchEvent(new CustomEvent("clinic:external"));
      } catch (_) {}
    }
  });
  return {
    entities,
    empty,
    snapshot,
    get: (entity) => clone(state[entity] || []),
    save,
    remove,
    replace,
    validateBackup,
    initialize,
    readLatest,
    KEY,
    get writable() {
      return writable;
    },
    get loadError() {
      return loadError;
    },
    get migrated() {
      return migrated;
    },
  };
})();
