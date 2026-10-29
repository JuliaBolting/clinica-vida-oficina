# Clínica Vida - Scrum na prática

Projeto educacional do IFSC Lages para desenvolver, testar e integrar um sistema
de gestão de clínica usando Scrum, GitHub e colaboração no VS Code.

A home, o painel, as listagens, a agenda, os temas e a infraestrutura local já
estão preparados. Os dados são fictícios. **As operações das equipes estão
intencionalmente incompletas**, com `TODO_OFICINA` e `OFICINA_PENDENTE` nos arquivos.

## Clonar e abrir

Pré-requisitos: Git, VS Code e navegador. Para colaborar, instalar Microsoft Live
Share no VS Code. Não é necessário Node, npm ou servidor de banco de dados.

Copie a URL HTTPS do repositório informado pelas organizadoras (botão Code no GitHub).
Substitua a URL de exemplo abaixo; não use literalmente o texto entre aspas:

```bash
git clone "COLE_A_URL_HTTPS_DO_REPOSITORIO" clinica-vida
cd clinica-vida
code .
```

Abra `index.html` no navegador ou `iniciar.bat` no Windows. Live Server também
funciona e facilita o compartilhamento de um servidor local pelo Live Share.

## Organização das equipes

Uma única base, sete grupos e duas entregas por grupo. Cada grupo precisa de um
Scrum Master; front, regras/dados e testes são focos de desenvolvimento. Os PDFs
entregues na oficina contêm os requisitos e o roteiro de cada sprint.

| Grupo | Sprint 1 - antes da Daily | Sprint 2 - depois da Daily |
| --- | --- | --- |
| 01 | Cadastrar Secretárias | Editar/excluir Médicos |
| 02 | Cadastrar Salas | Editar/excluir Agendamentos |
| 03 | Cadastrar Convênios | Editar/excluir Pacientes |
| 04 | Cadastrar Pacientes | Editar/excluir Convênios |
| 05 | Cadastrar Médicos | Editar/excluir Secretárias |
| 06 | Cadastrar Especialidades | Editar/excluir Salas |
| 07 | Cadastrar Agendamentos | Editar/excluir Especialidades |

Cada sprint usa dois arquivos em `js/funcionalidades/<modulo>/`:

- Sprint 1: `cadastro.front.js` e `cadastro.back.js`.
- Sprint 2: `manutencao.front.js` e `manutencao.back.js`.
- Bônus de estilo: somente `css/grupos/grupo-NN-sprint-N.css` da sua entrega.

Não altere `index.html`, os arquivos comuns, a home ou arquivos de outra equipe.
Campos e chaves devem manter o contrato. A interface pronta gera o formulário
pela lista `fields`; na edição usa a lista da manutenção. `validar` trata as
regras, `cadastrar` cria, `editar` preserva ID e `excluir` confere vínculos.
Use `ClinicStore.save`/`remove`, sem reimplementar o armazenamento.

## Quadro, Live Share e GitHub

Quadro da oficina: https://oficina-scrum.lovable.app/grupo/

Todos criam suas contas no quadro. O Scrum Master aceita o convite de colaborador
no GitHub, clona o projeto, cria a branch da sprint e inicia a sessão Live Share.
Os demais entram pelo link e usam conta Microsoft ou GitHub para editar. Login
no Live Share não exige que todos sejam colaboradores do repositório. Sem login,
o convidado tem acesso somente de leitura.

No quadro, o Scrum Master cadastra tarefas acordadas com o grupo, responsáveis e
horários. Cada participante atualiza o status das próprias tarefas conforme as
permissões do sistema. Registre impedimentos. A Daily está prevista para 10h30.

Exemplo para o grupo 01, sprint 1:

```bash
git switch -c grupo-01/sprint-1
git status
git add js/funcionalidades/secretarias/cadastro.front.js js/funcionalidades/secretarias/cadastro.back.js
git commit -m "Grupo 01: cadastro de secretarias"
git push -u origin grupo-01/sprint-1
```

Abra um pull request de sua branch para `main`; mantenha rascunho se houver
pendências. Somente as organizadoras fazem o merge final. `push` envia commits;
`pull` traz alterações e não abre um pull request. Substitua grupo, sprint e
caminhos pelos do seu PDF. O estilo opcional entra no commit apenas se alterado.

Para iniciar a segunda sprint, salve/commite o trabalho, confira `git status`
limpo e crie outra branch a partir de `main`:

```bash
git switch main
git pull --ff-only origin main
git switch -c grupo-01/sprint-2
```

A primeira entrega permanece na branch e no pull request da sprint 1. A segunda
usa outro módulo e pode ser testada com os exemplos existentes. Não copiar pastas
inteiras, forçar push ou substituir `main` pelo trabalho de um grupo.

## Dados locais

Os cadastros ficam no navegador da pessoa que abriu a aplicação. Live Share e
GitHub compartilham código, não o banco do navegador. Para conferir a entrega,
use o navegador da cópia principal do grupo ou o servidor local compartilhado.
Exportar/importar JSON transporta uma base inteira; a importação não mescla dados.
Enquanto regras estiverem pendentes, operações que dependem delas podem falhar.

Este repositório é só o programa e este README. Requisitos, testes, cronograma
e orientação das organizadoras são distribuídos separadamente em PDF.
