# UXSense Mobile Constitution

## Core Principles

### I. Contrato da API é imutável (NÃO NEGOCIÁVEL)

O aplicativo conversa com um servidor que não é alterado junto dele. Endpoints, verbos,
nomes de parâmetros, cabeçalhos de autenticação (`GSX-DEVICE`, `GSX-TOKEN`) e o formato do
campo `answer` (`{max, min, type, data}`, com as mesmas chaves de dados por técnica) MUST
permanecer idênticos em qualquer refatoração, migração ou troca de framework.

Toda mudança que afete o que trafega na rede MUST ser acompanhada de teste que compare a
saída nova com a anterior. Mudança de contrato só acontece quando o servidor mudar primeiro,
e nunca como efeito colateral de uma reescrita.

*Racional*: alunos em campo e dados de pesquisa já coletados dependem de o servidor
continuar entendendo exatamente o que o app envia.

### II. Recursos nativos são sempre opcionais

Todo acesso a plugin Cordova (device, push do Firebase, geolocalização, splash screen)
MUST ser protegido por verificação de existência e MUST ter caminho de fallback. O app
MUST abrir e navegar por completo em um navegador comum, sem nenhum plugin instalado.

Nenhuma promessa pode ficar pendente para sempre: chamadas nativas assíncronas MUST ter
timeout e resolver com valor neutro quando o recurso não responder.

*Racional*: o desenvolvimento diário e os testes automatizados rodam no navegador; um
acesso desprotegido quebra a tela inteira e só aparece no aparelho.

### III. Stack atual e livre de vulnerabilidades

O projeto MUST usar a última versão estável do Angular e do Ionic. `npm audit` MUST
reportar zero vulnerabilidades no momento do merge. O `package-lock.json` MUST ser
versionado, para que a instalação seja reprodutível e a auditoria signifique algo.

Dependência sem manutenção MUST ser substituída ou removida, não contornada. Segredos,
chaves de API e caches de build MUST NOT ser versionados.

*Racional*: foi a defasagem acumulada que tornou a migração necessária; manter-se atual
é mais barato do que repetir a travessia.

### IV. Verificação em três camadas antes de entregar

Nenhuma entrega é considerada pronta sem as três camadas:

1. **Build**: `npm run build` conclui sem erro.
2. **Testes**: `npm test` passa, e regras de negócio com cálculo (como as técnicas de
   avaliação) MUST ter teste comparando o resultado com a referência conhecida.
3. **Fluxo real**: as telas afetadas MUST ser exercitadas em um navegador de verdade,
   com a API simulada quando o servidor não estiver acessível, sem erro de JavaScript
   no console.

Relatar "funcionando" sem as três camadas é violação de constituição.

*Racional*: build verde não prova que a tela abre, e teste unitário não prova que o
fluxo do usuário chega ao fim.

### V. Textos da interface centralizados

Todo texto visível ao usuário MUST vir do dicionário de tradução, por chave. Componentes
e serviços MUST NOT conter mensagens escritas direto no código. A interface é em português
do Brasil.

**Exceção — vocabulário de domínio das técnicas**: os rótulos que fazem parte da definição
de um instrumento de avaliação (nomes das emoções do Emocards e do PrEmo, sentimentos do
PANAS, pares semânticos do AttrakDiff, dimensões do SAM, níveis do ESM) MAY ficar junto do
componente da técnica, como dado de domínio. Eles não são mensagens do aplicativo: são o
próprio instrumento, publicado e validado academicamente, e traduzi-los descaracteriza a
medição.

Quando um rótulo desses também identificar a chave enviada à API, o código MUST declarar
chave e rótulo separadamente. Derivar a chave do texto exibido subordina o contrato da API
à redação da interface e MUST NOT acontecer.

*Racional*: as mensagens são reaproveitadas entre telas e popups; espalhá-las gera
divergência de texto para a mesma situação. Já o vocabulário das técnicas pertence ao
instrumento, e mantê-lo ao lado da lógica que o calcula deixa a definição inteira visível
em um só lugar.

## Restrições Técnicas

- **Empacotamento**: o build do Angular MUST gravar em `www/`, pasta declarada no
  `config.xml`. O build nativo é sempre `npm run build` seguido de `cordova build`.
- **Roteamento**: as rotas MUST usar hash (`#/rota`), único formato que funciona quando o
  app roda a partir de `file://` dentro do Cordova.
- **Sessão**: a sessão MUST continuar sendo guardada nas chaves de `localStorage`
  `authData`, `authHeader` e `terms`, para que atualizações não desloguem quem já usa o app.
- **Node**: a versão exigida pelo Angular CLI em uso MUST estar declarada em `engines` e
  no README.
- **Saída de build**: `www/` MUST NOT ser versionada.

## Fluxo de Desenvolvimento

O projeto usa Spec Kit. Mudanças relevantes seguem a ordem:

1. `/speckit-specify` — o que muda e por quê, sem decisão de implementação.
2. `/speckit-plan` — decisões técnicas, alternativas e checagem contra esta constituição.
3. `/speckit-tasks` — tarefas executáveis e verificáveis.
4. `/speckit-implement` ou `/speckit-converge` — execução, ou reconciliação quando o
   código já existe.

Correções pontuais e ajustes de texto não exigem o ciclo completo. Toda entrega vai para
um Pull Request em rascunho, com a verificação das três camadas descrita no corpo.

## Governança

Esta constituição prevalece sobre preferências pessoais e sobre convenções herdadas do
código antigo. Em conflito entre velocidade e qualquer princípio, o princípio vence.

**Emendas**: alterações MUST ser propostas em Pull Request próprio, com justificativa e
impacto nos artefatos existentes. A versão segue versionamento semântico:

- **MAJOR**: remoção ou redefinição incompatível de princípio.
- **MINOR**: novo princípio ou seção, ou ampliação material de orientação.
- **PATCH**: esclarecimento, redação ou correção sem mudança de significado.

**Conformidade**: toda revisão de Pull Request MUST verificar os princípios aplicáveis.
Desvio consciente MUST ser registrado no plano da mudança, na seção de rastreamento de
complexidade, com a justificativa e a alternativa descartada.

**Version**: 1.1.0 | **Ratified**: 2026-09-15 | **Last Amended**: 2026-09-15
