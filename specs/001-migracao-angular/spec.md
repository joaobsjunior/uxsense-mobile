# Feature Specification: Migração do aplicativo para Angular

**Feature Branch**: `claude/relaxed-hawking-b6q8r8`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "Faça a migração do projeto para Angular, pois hoje ele é AngularJS, migre para o Angular (ng) na última versão estável. E garanta que não tenha nenhuma vulnerabilidade e que o projeto esteja funcionando integralmente. Executando o build e rodando perfeitamente."

## User Scenarios & Testing *(mandatory)*

O aplicativo é usado por alunos que respondem, pelo celular, perguntas curtas sobre a
experiência que tiveram em aula. A migração não pode mudar nada do que essas pessoas veem
ou fazem: as jornadas abaixo descrevem o comportamento que deve continuar idêntico depois
da troca de framework.

### User Story 1 - Responder uma pergunta recebida (Priority: P1)

O aluno é avisado de que existe uma pergunta pendente, abre a pergunta, responde usando a
técnica de avaliação escolhida pelo pesquisador e envia. A resposta chega ao servidor no
mesmo formato de sempre, junto da data, da hora e, quando disponível, da localização.

**Why this priority**: é a razão de existir do aplicativo. Sem ela, nada mais tem valor,
e é a jornada onde um erro de migração corrompe dados de pesquisa em silêncio.

**Independent Test**: com uma pergunta pendente no servidor, dá para percorrer do aviso
até a confirmação de envio e conferir o conteúdo enviado, sem depender das outras telas.

**Acceptance Scenarios**:

1. **Given** um aluno autenticado com uma pergunta pendente, **When** ele abre o app,
   **Then** o app avisa que há pergunta pendente e oferece responder agora ou depois.
2. **Given** o aviso de pergunta pendente, **When** o aluno escolhe responder agora,
   **Then** a tela de resposta abre com o enunciado da pergunta e o caminho
   grupo/subgrupo/time da turma.
3. **Given** a tela de resposta aberta, **When** o aluno tenta enviar sem responder,
   **Then** o app avisa que é preciso escolher uma opção e não envia nada.
4. **Given** uma resposta completa, **When** o aluno envia, **Then** o servidor recebe
   `answer` como string JSON no formato `{max, min, type, data}` com as chaves da técnica,
   mais `date`, `time`, `client_id`, `scheduler_id` e `technique_id`.
5. **Given** o envio aceito, **When** a confirmação é fechada, **Then** o app volta para a
   lista de respostas e verifica se existe outra pergunta pendente.

---

### User Story 2 - Entrar no aplicativo (Priority: P1)

Na primeira execução o aluno aceita os termos de uso; depois disso entra com login e senha
e permanece autenticado nas próximas aberturas.

**Why this priority**: é a porta de entrada. Se a sessão não sobreviver à atualização,
todos os alunos instalados são deslogados de uma vez.

**Independent Test**: instalar, aceitar os termos, entrar, fechar e reabrir o app,
verificando que a sessão continua.

**Acceptance Scenarios**:

1. **Given** um app recém-instalado, **When** o aluno o abre, **Then** a tela de termos de
   uso aparece antes de qualquer outra.
2. **Given** os termos aceitos, **When** o aluno tenta entrar com o formulário vazio,
   **Then** o app avisa que existem campos obrigatórios não preenchidos.
3. **Given** os termos aceitos, **When** o aluno informa senha com menos de 6 caracteres,
   **Then** o app avisa que a senha deve ter no mínimo 6 caracteres.
4. **Given** credenciais válidas, **When** o aluno entra, **Then** a home é exibida com a
   saudação usando o primeiro nome dele.
5. **Given** um aluno que já estava autenticado na versão anterior do app, **When** o app é
   atualizado e aberto, **Then** ele continua autenticado, sem precisar entrar de novo.

---

### User Story 3 - Gerenciar as turmas que acompanha (Priority: P2)

O aluno vê as turmas em que está inscrito, adiciona uma nova escolhendo grupo, subgrupo e
time em listas encadeadas, e remove as que não quer mais acompanhar.

**Why this priority**: sem turma o aluno não recebe perguntas, mas é uma ação pontual,
feita poucas vezes.

**Independent Test**: entrar na aba de times, cadastrar uma turma e removê-la.

**Acceptance Scenarios**:

1. **Given** a aba de times, **When** ela é aberta, **Then** as turmas do aluno são listadas
   com time, subgrupo e unidade.
2. **Given** a tela de nova turma, **When** o aluno escolhe um grupo, **Then** a lista de
   subgrupos é carregada e as escolhas anteriores de subgrupo e time são limpas.
3. **Given** grupo, subgrupo e time escolhidos, **When** o aluno confirma, **Then** o app
   avisa que a turma foi cadastrada e volta para a lista de times.
4. **Given** uma turma na lista, **When** o aluno pede para remover, **Then** o app pede
   confirmação antes de remover.

---

### User Story 4 - Consultar respostas e manter os dados da conta (Priority: P3)

O aluno consulta o histórico do que já respondeu e atualiza nome, e-mail, sexo, data de
nascimento ou senha; também consegue sair do aplicativo.

**Why this priority**: são telas de apoio; não bloqueiam a coleta de dados.

**Independent Test**: abrir a aba de respostas e a de conta, alterar um dado e salvar.

**Acceptance Scenarios**:

1. **Given** um aluno sem respostas, **When** ele abre a aba de respostas, **Then** uma
   mensagem explica que ainda não há respostas.
2. **Given** a aba de minha conta, **When** ela é aberta, **Then** os campos já vêm
   preenchidos com os dados atuais do aluno.
3. **Given** o campo de senha atual vazio e uma nova senha preenchida, **When** o aluno
   salva, **Then** o app avisa que a senha atual é obrigatória e limpa os campos de nova senha.
4. **Given** nova senha e confirmação diferentes, **When** o aluno salva, **Then** o app
   avisa que as senhas não coincidem.

---

### Edge Cases

- **Servidor fora do ar**: qualquer requisição que demore mais de 30 segundos é tratada
  como indisponibilidade e exibe a mensagem de servidor não respondendo.
- **Sessão expirada**: quando o servidor responde 401, o app avisa, limpa a sessão e leva
  o aluno de volta ao login.
- **Busca de pergunta pendente falhando repetidamente**: a verificação em segundo plano não
  pode repetir sem pausa; deve esperar entre tentativas e desistir depois de algumas falhas.
- **Aparelho sem plugin nativo** (navegador ou emulador): ausência de push, geolocalização,
  splash screen ou dados do aparelho não pode impedir o uso do app.
- **Geolocalização negada**: a resposta é enviada sem coordenadas.
- **Resposta parcial**: técnicas que exigem todas as escalas preenchidas não podem enviar
  resposta incompleta, e as escalas faltantes devem ficar destacadas depois da tentativa.

## Requirements *(mandatory)*

### Functional Requirements

**Plataforma**

- **FR-001**: O aplicativo MUST ser construído sobre a última versão estável do Angular, em
  substituição ao AngularJS.
- **FR-002**: O projeto MUST gerar o pacote consumido pelo Cordova sem alteração no
  `config.xml`, mantendo Android e iOS como alvos.
- **FR-003**: O projeto MUST reportar zero vulnerabilidades em auditoria de dependências.
- **FR-004**: O projeto MUST versionar o arquivo de trava de dependências, para que a
  instalação seja reprodutível.

**Paridade de comportamento**

- **FR-005**: O app MUST usar os mesmos endpoints, verbos e parâmetros da API usados hoje.
- **FR-006**: O app MUST enviar a resposta de cada técnica no formato
  `{max, min, type, data}`, com as mesmas chaves e os mesmos valores calculados de hoje.
- **FR-007**: O app MUST manter a sessão nas mesmas chaves de armazenamento local, de modo
  que alunos já autenticados permaneçam autenticados após a atualização.
- **FR-008**: O app MUST manter os mesmos textos, validações e mensagens de aviso.
- **FR-009**: O app MUST manter as sete técnicas de avaliação: Emocards, Affect Grid,
  PANAS, AttrakDiff, PrEmo, ESM e SAM.
- **FR-010**: O app MUST manter a navegação por abas: Home, Times, Respostas e Minha Conta.
- **FR-017**: O app MUST permitir trocar de aba deslizando o dedo na horizontal, exceto na
  tela de resposta, onde o gesto concorreria com as escalas das técnicas.
- **FR-018**: A tela de resposta MUST NOT oferecer botão de voltar: a saída é pela troca de
  aba, como no app original.

**Robustez**

- **FR-011**: O app MUST funcionar integralmente em um navegador comum, sem nenhum plugin
  nativo instalado.
- **FR-012**: O app MUST tratar indisponibilidade do servidor com mensagem ao usuário e
  sem repetição em laço fechado.
- **FR-013**: O app MUST exibir indicador de carregamento enquanto houver requisição em
  andamento iniciada por ação do usuário.
- **FR-014**: O app MUST encerrar a sessão e retornar ao login quando o servidor indicar
  que a autenticação não é mais válida.

**Qualidade**

- **FR-015**: O projeto MUST ter teste automatizado que comprove que o cálculo das técnicas
  produz os mesmos valores da implementação anterior.
- **FR-016**: O projeto MUST executar build e testes por comandos documentados no README.

### Key Entities

- **Aluno (client)**: quem responde. Nome, e-mail, login, sexo, data de nascimento.
- **Sessão**: identificação do aparelho e token que autorizam as chamadas à API, mais o
  registro de aceite dos termos de uso.
- **Turma (team)**: unidade de agrupamento que o aluno acompanha; pertence a um subgrupo,
  que pertence a um grupo, e está ligada a uma unidade.
- **Pergunta agendada (scheduler)**: o que o aluno precisa responder. Reúne o enunciado, a
  turma e a técnica de avaliação a ser usada.
- **Técnica de avaliação**: a forma de capturar a emoção (sete variações). Define quais
  chaves e faixas de valores compõem a resposta.
- **Resposta (answer)**: o que é enviado ao servidor. Data, hora, aluno, pergunta, técnica,
  o conteúdo da avaliação e, quando houver, a localização.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O comando de build conclui sem erro e gera o pacote na pasta lida pelo Cordova.
- **SC-002**: A auditoria de dependências reporta zero vulnerabilidades.
- **SC-003**: As sete técnicas podem ser respondidas e enviadas, e o conteúdo enviado é
  idêntico, campo a campo, ao que a versão anterior enviava para a mesma interação.
- **SC-004**: Um percurso completo pelas telas (termos, login, quatro abas, cadastro e
  remoção de turma, atualização de conta e envio de resposta) acontece sem nenhum erro de
  JavaScript no console.
- **SC-005**: Um aluno autenticado na versão anterior continua autenticado após a
  atualização, sem refazer login.
- **SC-006**: Com o servidor inacessível, o app exibe a mensagem de indisponibilidade e não
  emite requisições em laço fechado.

## Assumptions

- O servidor da API não muda como parte desta migração: o contrato é fixo e o app é quem
  se adapta.
- O visual pode ser modernizado pelos componentes da nova versão do framework, desde que a
  identidade (paleta, disposição das telas, figuras das técnicas) permaneça reconhecível.
- Os plugins Cordova em uso continuam os mesmos; atualizá-los está fora do escopo.
- O build nativo para Android e iOS é executado no ambiente do mantenedor, fora deste
  escopo de verificação.
- A técnica de identificador 7 não existe no app atual e permanece inexistente.
- Perguntas pendentes continuam sendo descobertas por consulta ao servidor e por
  notificação push, como hoje.
