---

description: "Task list for the AngularJS to Angular migration"
---

# Tasks: Migração do aplicativo para Angular

**Input**: Design documents from `/specs/001-migracao-angular/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: incluídos porque a especificação exige (FR-015) prova automatizada de que o
cálculo das técnicas continua produzindo os mesmos valores.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: história de usuário a que a tarefa pertence (US1..US4)

## Path Conventions

Projeto único de aplicativo móvel: código em `src/`, saída de build em `www/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: trocar o esqueleto do projeto — sai bower/gulp, entra Angular CLI.

- [X] T001 Gerar o esqueleto do Angular 22 na raiz (`angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, `src/main.ts`, `src/index.html`)
- [X] T002 Declarar dependências, scripts (`start`, `build`, `watch`, `test`) e faixa de Node em `package.json`
- [X] T003 Configurar o build em `angular.json`: saída em `www/`, `baseHref` relativo, assets de `src/assets`, CSS do Ionic e limites de tamanho
- [X] T004 [P] Atualizar `.gitignore`: `www/` vira saída de build e `package-lock.json` passa a ser versionado
- [X] T005 [P] Atualizar `ionic.config.json` para o tipo `angular-standalone`
- [X] T006 Remover os fontes AngularJS: `controller/`, `scss/`, `www/` (view, js, lib, service, locale), `gulpfile.js`, `bower.json`, `.bowerrc`
- [X] T007 [P] Mover as figuras das técnicas para `src/assets/img/` (premo, sam, esm)
- [X] T008 [P] Remover do versionamento a chave do Ionic Cloud (`.io-config.json`), o hook Cordova do Ionic v1 (`hooks/`) e o cache do Gradle

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: infraestrutura que toda história depende — tema, textos, sessão, API e casca de navegação.

**⚠️ CRITICAL**: nenhuma história pode ser concluída antes desta fase.

- [X] T009 [P] Portar a paleta do app antigo para `src/theme/_palette.scss`
- [X] T010 [P] Definir o tema Ionic em `src/theme/variables.scss` (primary `#036b77`, danger `#ef473a`)
- [X] T011 [P] Portar os estilos globais e das técnicas para `src/global.scss`
- [X] T012 [P] Declarar os contratos da API em `src/app/core/models.ts`
- [X] T013 [P] Portar o dicionário português para `src/app/core/i18n/pt.ts`
- [X] T014 [P] Criar o serviço de tradução em `src/app/core/i18n/translate.service.ts` e o pipe em `src/app/core/i18n/translate.pipe.ts`
- [X] T015 Criar `src/app/core/session.service.ts` preservando as chaves `authData`, `authHeader` e `terms`
- [X] T016 [P] Criar o indicador de carregamento com contador em `src/app/core/loading.service.ts`
- [X] T017 [P] Criar os diálogos (alerta e confirmação) em `src/app/core/dialog.service.ts`
- [X] T018 [P] Definir as opções por requisição em `src/app/core/api.types.ts`
- [X] T019 Implementar os 15 endpoints de `contracts/api.md` em `src/app/core/api.service.ts`
- [X] T020 Implementar cabeçalhos, spinner, timeout de 30s, tradução de erro e logout no 401 em `src/app/core/api.interceptor.ts`
- [X] T021 [P] Encapsular os plugins Cordova com verificação e fallback em `src/app/core/device.service.ts`
- [X] T022 [P] Implementar as regras de acesso às rotas em `src/app/core/guards.ts`
- [X] T023 Criar a casca do app em `src/app/app.ts` e os providers em `src/app/app.config.ts` (Ionic, rotas com hash, HTTP com interceptor)
- [X] T024 Declarar as rotas com carregamento sob demanda em `src/app/app.routes.ts`
- [X] T025 Criar a navegação por abas em `src/app/pages/tabs/tabs.page.ts`

---

## Phase 3: User Story 1 - Responder uma pergunta recebida (Priority: P1) 🎯 MVP

**Goal**: o aluno recebe o aviso de pergunta pendente, responde pela técnica indicada e envia, com o servidor recebendo exatamente o formato de sempre.

**Independent Test**: com uma pergunta pendente no servidor, percorrer do aviso até a confirmação de envio e conferir o corpo enviado contra `contracts/techniques.md`.

- [X] T026 [P] [US1] Definir o contrato comum das técnicas em `src/app/techniques/technique.types.ts`
- [X] T027 [P] [US1] Implementar Emocards em `src/app/techniques/emocards/` reaproveitando o SVG original com seleção ligada ao estado
- [X] T028 [P] [US1] Implementar Affect Grid em `src/app/techniques/affect-grid/` com o cálculo das oito dimensões
- [X] T029 [P] [US1] Implementar PANAS em `src/app/techniques/panas/` (20 sentimentos, nota de 1 a 5)
- [X] T030 [P] [US1] Implementar AttrakDiff em `src/app/techniques/attrakdiff/` (14 escalas de 0 a 6)
- [X] T031 [P] [US1] Implementar PrEmo em `src/app/techniques/premo/` (14 emoções, múltipla escolha)
- [X] T032 [P] [US1] Implementar ESM em `src/app/techniques/esm/` (cinco níveis, escolha única)
- [X] T033 [P] [US1] Implementar SAM em `src/app/techniques/sam/` (três escalas de 0 a 8)
- [X] T034 [US1] Implementar a tela de resposta em `src/app/pages/answer-send/`: enunciado, seleção da técnica, aviso de resposta obrigatória e envio com data, hora e localização
- [X] T035 [US1] Implementar a verificação de pergunta pendente em `src/app/core/question.service.ts`, com aviso "responder agora/depois", espera entre tentativas e limite de tentativas
- [X] T036 [P] [US1] Testar a paridade das 81 células do Affect Grid em `src/app/techniques/affect-grid/affect-grid.component.spec.ts`
- [X] T037 [P] [US1] Testar o mapeamento das oito emoções do Emocards em `src/app/techniques/emocards/emocards.component.spec.ts`

**Checkpoint**: a jornada principal do app funciona ponta a ponta.

---

## Phase 4: User Story 2 - Entrar no aplicativo (Priority: P1)

**Goal**: aceite dos termos, login com validação e sessão que sobrevive à atualização do app.

**Independent Test**: instalar, aceitar os termos, entrar, fechar e reabrir, verificando que a sessão continua.

- [X] T038 [P] [US2] Implementar a tela de termos em `src/app/pages/term/term.page.ts`, registrando o tratamento de push ao aceitar
- [X] T039 [P] [US2] Centralizar as regras de validação em `src/app/shared/validation.ts`
- [X] T040 [US2] Implementar login, logout e envio do token de push em `src/app/core/auth.service.ts`
- [X] T041 [US2] Implementar a tela de login em `src/app/pages/login/` com os avisos de campo obrigatório e senha curta
- [X] T042 [P] [US2] Implementar a tela de cadastro em `src/app/pages/signup/`
- [X] T043 [P] [US2] Implementar a tela de recuperação de senha em `src/app/pages/lost-password/`
- [X] T044 [P] [US2] Implementar a home com a saudação em `src/app/pages/home/home.page.ts`
- [X] T045 [P] [US2] Testar as regras de validação em `src/app/shared/validation.spec.ts`
- [X] T046 [US2] Registrar o tratamento de push também na abertura do app, em `src/app/app.ts`

**Checkpoint**: o aluno entra, permanece autenticado e chega à jornada principal.

---

## Phase 5: User Story 3 - Gerenciar as turmas que acompanha (Priority: P2)

**Goal**: listar, cadastrar e remover turmas.

**Independent Test**: abrir a aba de times, cadastrar uma turma e removê-la.

- [X] T047 [US3] Implementar a lista de times em `src/app/pages/teams/` com puxar para atualizar, remoção com confirmação e botão flutuante
- [X] T048 [US3] Implementar o cadastro de turma em `src/app/pages/new-team/` com as listas encadeadas de grupo, subgrupo e time

**Checkpoint**: o aluno controla de quais turmas recebe perguntas.

---

## Phase 6: User Story 4 - Consultar respostas e manter os dados da conta (Priority: P3)

**Goal**: histórico de respostas e edição dos dados da conta.

**Independent Test**: abrir as duas abas, alterar um dado e salvar.

- [X] T049 [P] [US4] Implementar o histórico em `src/app/pages/answers/` com puxar para atualizar e mensagem de lista vazia
- [X] T050 [US4] Implementar a tela de conta em `src/app/pages/my-account/` com as regras de troca de senha e o botão de sair

**Checkpoint**: todas as telas do app antigo existem na versão nova.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T051 [P] Reescrever o `README.md` com requisitos, comandos, estrutura e tabela das técnicas
- [X] T052 Confirmar `npm audit` sem vulnerabilidades
- [X] T053 Confirmar que `npm run build` conclui e grava em `www/`
- [X] T054 Confirmar que `npm test` passa, incluindo os testes de paridade
- [X] T055 Percorrer o fluxo completo em navegador com a API simulada, conferindo o corpo enviado nas sete técnicas e a ausência de erro de JavaScript no console

---

## Dependencies

```text
Setup (T001-T008)
   └─> Foundational (T009-T025)
          ├─> US1 (T026-T037)   ← MVP
          ├─> US2 (T038-T046)
          ├─> US3 (T047-T048)
          └─> US4 (T049-T050)
                 └─> Polish (T051-T055)
```

- As histórias não dependem entre si depois da fase Foundational: cada uma toca as próprias
  telas. US2 é o caminho natural para exercitar as demais na prática, mas não é bloqueio
  técnico, já que a sessão pode ser semeada no armazenamento local.
- Dentro da fase Foundational, `api.service` (T019) e `api.interceptor` (T020) dependem de
  `api.types` (T018) e `session.service` (T015).

## Parallel Execution Examples

- **Fase 2**: T009, T010, T011 (estilos), T012, T013, T014 (textos e contratos), T016, T017,
  T021, T022 podem ser escritos em paralelo — arquivos distintos, sem dependência mútua.
- **US1**: T027 a T033 são sete componentes independentes; só T034 depende de todos.
- **US2**: T042, T043, T044 são telas isoladas e podem sair em paralelo a T041.

## Implementation Strategy

Entregar primeiro **US1**, que é o MVP: sem ela o app não cumpre sua função. As demais
histórias completam a paridade com o app antigo. A fase de polimento é a verificação em
três camadas exigida pela constituição, e nenhuma entrega é declarada pronta sem ela.

---

## Phase 8: Convergence

Trabalho restante identificado ao confrontar o código com a especificação, o plano e a
constituição. Cada item traz a origem e o tipo de lacuna.

- [X] T056 CRITICAL Mover para o dicionário os textos de interface escritos direto nos componentes — parágrafo da home, título dos termos, dicas das sete técnicas e rótulos das opções de sexo — em `src/app/core/i18n/pt.ts` e nos templates correspondentes, per Constitution V (contradicts)
- [X] T057 Declarar chave e rótulo separadamente nos sentimentos do PANAS, em `src/app/techniques/panas/panas.component.ts`, para que a chave enviada à API não dependa do texto exibido, per Constitution I e FR-006 (partial)
- [X] T058 Verificar que uma sessão gravada pela versão anterior mantém o aluno autenticado após a atualização, per SC-005 (missing)
- [X] T059 Verificar que, com o servidor inacessível, o app exibe a indisponibilidade e não emite requisições em laço fechado, per SC-006 (missing)
- [X] T060 Verificar que a resposta é enviada sem coordenadas quando a geolocalização é negada, per spec: Edge Cases (missing)

---

## Phase 9: Convergence (verificação de paridade)

Lacunas encontradas ao comparar, função a função, o app AngularJS do histórico com o
código novo, e verificações de fluxo que ainda não tinham sido feitas.

- [X] T061 Implementar a troca de aba por deslize horizontal em `src/app/pages/tabs/tabs.page.ts`, desligada na tela de resposta, per FR-017 (missing)
- [X] T062 Remover o botão de voltar da tela de resposta em `src/app/pages/answer-send/answer-send.page.html`, per FR-018 (contradicts)
- [X] T063 Verificar o cadastro ponta a ponta: campos obrigatórios, senhas diferentes, sucesso e dados enviados, per US2 (missing)
- [X] T064 Verificar a recuperação de senha nas duas respostas do servidor (`sent` verdadeiro e falso), per US2 (missing)
- [X] T065 Verificar o logout: chamada à API, limpeza da sessão e retorno ao login, per US4 (missing)
- [X] T066 Verificar o tratamento de sessão expirada (401): aviso, limpeza e retorno ao login, per FR-014 (missing)
- [X] T067 Verificar o gesto de puxar para atualizar na lista de times, per US3 (missing)
- [X] T068 Verificar que o indicador de carregamento aparece durante a requisição e some ao fim, per FR-013 (missing)
