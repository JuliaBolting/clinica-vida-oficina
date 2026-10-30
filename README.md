# Clínica Vida - Scrum na prática

Sistema educacional do IFSC Lages para praticar requisitos, desenvolvimento,
testes e integração com Scrum. Dados fictícios e armazenamento local no navegador.

A home, os temas claro e escuro, o painel, as listagens e a infraestrutura estão
prontos. **Agendamentos está completo**, inclusive cadastrar, editar, cancelar,
excluir e validar conflitos, e serve de referência para as equipes. Os outros
seis módulos têm trechos marcados com `TODO_OFICINA` e `OFICINA_PENDENTE`.

## Clonar e executar

Instale Git, VS Code e um navegador. Não precisa de Node, npm ou banco de dados.

```bash
git clone https://github.com/JuliaBolting/clinica-vida-oficina.git
cd clinica-vida-oficina
code .
```

Abra `index.html` ou execute `iniciar.bat` no Windows. A extensão Live Server é
opcional e facilita compartilhar um servidor local pelo Live Share.

## Três grupos, duas sprints

Cada módulo inteiro pertence a uma única equipe: conversar com o P.O, cadastrar,
listar, editar/alterar, excluir, validar e testar. Há um PDF de uma página para
cada sprint, distribuído separadamente. São seis entregas ao todo.

| Grupo | Sprint 1 - antes da Daily | Sprint 2 - depois da Daily |
| --- | --- | --- |
| 01 | Secretárias: CRUD completo | Pacientes: CRUD completo |
| 02 | Salas: CRUD completo | Convênios: CRUD completo |
| 03 | Especialidades: CRUD completo | Médicos: CRUD completo |

Composição sugerida: Scrum Master, back e front. Um Scrum Master é obrigatório
por grupo. Tester é opcional; se não houver, cada pessoa testa sua parte e o time
testa o fluxo completo. Nesta oficina, back significa regras e persistência em
JavaScript no navegador, sem API ou servidor.

## Arquivos de cada entrega

Cada módulo tem somente dois arquivos de autoria da equipe:

- `js/funcionalidades/<modulo>/formulario.front.js`: campos de cadastro e edição,
  rótulos, tipos e confirmação de exclusão.
- `js/funcionalidades/<modulo>/crud.back.js`: `validar`, `salvar` e `excluir`.
  `salvar` cria quando não há ID e edita mantendo o mesmo ID quando ele existe.
- Estilo opcional: `css/grupos/grupo-NN-sprint-N.css` da própria sprint.

O módulo completo de referência usa os mesmos contratos em
`js/funcionalidades/agendamentos/`. Leia como os campos geram o formulário, como
`salvar` valida e usa `ClinicStore.save`, e como `excluir` usa `ClinicStore.remove`.
Adapte as regras ao seu módulo e às respostas do P.O. Preserve as chaves dos campos.

Não altere os arquivos compartilhados, a home, a agenda pronta ou outro módulo.
Use apenas os arquivos da própria sprint; assim, os seis pull requests podem ser
integrados sem duas equipes editarem o mesmo arquivo. O estilo opcional também
tem um arquivo exclusivo.

## Quadro e trabalho conjunto

Quadro da oficina: https://oficina-scrum.lovable.app/grupo/

Todos criam conta no quadro. Após a abertura e a divisão dos grupos, o Scrum
Master aceita o convite de colaborador no GitHub, clona a base e inicia o Live
Share no VS Code. Os demais entram no link com conta Microsoft ou GitHub para
editar; convidados sem login ficam em modo de leitura. Só o Scrum Master precisa
ser colaborador do repositório neste fluxo.

Antes de programar, o grupo pergunta os requisitos ao P.O. O Scrum Master
registra tarefas, responsáveis e horários no quadro. Cada participante atualiza
as próprias tarefas e sinaliza impedimentos. A Daily ocorre às **10h30**: o que
fizemos, o que faremos e o que nos impede. Não agende tarefas durante a Daily.

## Commit, push e pull request

Exemplo do grupo 01 na sprint 1, com o CRUD inteiro de Secretárias:

```bash
git switch -c grupo-01/sprint-1
git status
git add js/funcionalidades/secretarias/ css/grupos/grupo-01-sprint-1.css
git commit -m "Grupo 01 sprint 1: CRUD de secretarias"
git push -u origin grupo-01/sprint-1
```

No GitHub, abra um pull request dessa branch para `main` e descreva a entrega,
os testes e as pendências. As organizadoras fazem o merge final. `push` envia
commits; `pull` traz alterações; pull request é o pedido de revisão/integração.

Antes da segunda sprint, salve e commite o trabalho na branch da primeira,
confira `git status` limpo e crie a nova branch a partir de `main`:

```bash
git switch main
git pull --ff-only origin main
git switch -c grupo-01/sprint-2
```

O exemplo acima muda para Pacientes. Os grupos 02 e 03 usam seus números e os
módulos da tabela. A primeira entrega permanece em seu próprio pull request,
mesmo se ainda não foi integrada. A sprint 2 pode usar os dados de exemplo e
os agendamentos completos. Não precisa aguardar o merge da primeira.

## Dados e conferência

Use dados fictícios. Os dados persistem após recarregar, no mesmo navegador e
endereço. GitHub/Live Share compartilham código, não o armazenamento do navegador.
Verifique a entrega no navegador da cópia principal do grupo. Para transportar
dados, exporte/importe JSON; a importação substitui uma base inteira, não mescla.
Enquanto houver validadores pendentes, importação e outras rotinas que os chamem
podem ser bloqueadas. Não remova validações para contornar o exercício.

Requisitos, roteiro das organizadoras e material do P.O são entregues fora deste
repositório. O repositório contém o programa e este README.
