# Implementation Plan: Migração do aplicativo para Angular

**Branch**: `claude/relaxed-hawking-b6q8r8` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-migracao-angular/spec.md`

## Summary

Reescrever o aplicativo móvel do UXSense — hoje AngularJS 1.8.3 com Ionic v1, empacotado
com Cordova — sobre a última versão estável do Angular, sem alterar nada do que o servidor
recebe e nada do que o aluno vê. A abordagem é substituir o framework camada por camada,
preservando os contratos observáveis: endpoints da API, formato da resposta de cada
técnica, chaves de armazenamento local, textos e regras de validação.

O código antigo (controllers globais, bibliotecas versionadas via bower, pipeline gulp) é
descartado; a estrutura nova é um projeto Angular CLI com componentes standalone. O Ionic 9
substitui o Ionic v1 para que os componentes de interface móvel (abas, listas, campos,
popups, indicador de carregamento) continuem existindo em vez de precisarem ser
reconstruídos em CSS próprio.

## Technical Context

**Language/Version**: TypeScript 6.0 sobre Angular 22.1 (última estável em 2026-09-15)

**Primary Dependencies**: `@angular/{core,common,forms,router,platform-browser}` 22.1,
`@ionic/angular` 9.0 (componentes de UI, overlays e abas roteadas), `ionicons` 8,
`rxjs` 7.8

**Storage**: `localStorage` do navegador/webview, nas chaves já usadas hoje —
`authData`, `authHeader`, `terms`

**Testing**: Vitest com ambiente jsdom, através do builder `@angular/build:unit-test`
(padrão do Angular CLI 22); verificação de fluxo com navegador real dirigido por Playwright
e API simulada

**Target Platform**: Android e iOS via Cordova (webview), e navegador comum durante o
desenvolvimento

**Project Type**: aplicativo móvel híbrido de página única

**Performance Goals**: abertura do app e troca de aba sem espera perceptível; pacote
inicial pequeno o bastante para carregar de arquivo local no aparelho

**Constraints**: o app roda a partir de `file://` dentro do Cordova, o que exige rotas com
hash e caminhos relativos; sem plugin nativo disponível no navegador, tudo precisa
degradar; a API responde em `http://` e não muda

**Scale/Scope**: 11 telas, 7 técnicas de avaliação, 15 endpoints de API, uso individual
por aluno

## Constitution Check

*GATE: avaliado antes da Fase 0 e revisto após a Fase 1, contra a constituição v1.1.0.*

| Princípio | Como o plano atende | Resultado |
|-----------|--------------------|-----------|
| I. Contrato da API é imutável | O cliente HTTP novo replica verbo, caminho e parâmetros de cada chamada do `requestService` antigo; o cálculo de cada técnica é portado preservando chaves, ordem e faixas; teste automatizado compara o resultado com a implementação anterior | PASS |
| II. Recursos nativos são sempre opcionais | Todo plugin fica atrás de um serviço único (`DeviceService`) que verifica existência e tem fallback; chamadas assíncronas nativas recebem timeout | PASS |
| III. Stack atual e livre de vulnerabilidades | Angular 22.1 e Ionic 9, últimas estáveis; bower, gulp, node-sass e jQuery saem; `package-lock.json` passa a ser versionado; auditoria precisa fechar em zero | PASS |
| IV. Verificação em três camadas | Build, testes unitários (incluindo paridade das técnicas) e percurso completo em navegador com API simulada | PASS |
| V. Textos centralizados | Dicionário português portado integralmente para um serviço de tradução com pipe equivalente ao filtro antigo | PASS |

Nenhuma violação a justificar. A seção de rastreamento de complexidade permanece vazia.

**Revisão pós-Fase 1**: o desenho não introduziu camada, dependência ou abstração além das
previstas acima. Gate mantido em PASS.

**Revisão na convergência**: a avaliação do código contra os artefatos encontrou duas
lacunas de princípio — textos de interface escritos direto nos componentes (V) e a chave do
PANAS derivada do rótulo exibido (I e V). Ambas viraram tarefas na fase de convergência e
foram corrigidas. A exceção para o vocabulário de domínio das técnicas foi incorporada à
constituição na emenda v1.1.0, com a regra de que chave e rótulo sejam sempre declarados
separadamente.

## Project Structure

### Documentation (this feature)

```text
specs/001-migracao-angular/
├── plan.md              # Este arquivo
├── research.md          # Fase 0: decisões e alternativas
├── data-model.md        # Fase 1: entidades e formato das respostas
├── quickstart.md        # Fase 1: como rodar, testar e empacotar
├── contracts/
│   ├── api.md           # Endpoints consumidos, com verbos e parâmetros
│   └── techniques.md    # Formato da resposta de cada técnica
└── tasks.md             # Fase 2 (gerado por /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── main.ts                   # Bootstrap da aplicação
├── index.html
├── global.scss               # Estilos globais portados do app antigo
├── theme/                    # Paleta e variáveis de tema do Ionic
├── assets/img/               # Figuras das técnicas (PrEmo, SAM, ESM)
└── app/
    ├── app.ts                # Casca: ion-app + ion-router-outlet
    ├── app.config.ts         # Providers: Ionic, rotas com hash, HTTP + interceptor
    ├── app.routes.ts         # Rotas com carregamento sob demanda e guards
    ├── core/                 # Sessão, API, interceptor, diálogos, i18n, nativo, guards
    ├── pages/                # Uma pasta por tela
    ├── techniques/           # Um componente por técnica de avaliação
    └── shared/               # Validações reutilizadas

config.xml                    # Cordova: inalterado, continua lendo www/
angular.json                  # Build do Angular grava em www/
```

**Structure Decision**: projeto único de aplicativo móvel. A separação por pastas segue a
responsabilidade: `core/` concentra o que era `$rootScope` e serviços globais, `pages/`
substitui os controllers por tela, `techniques/` isola as sete formas de avaliação (a
parte com regra de cálculo e maior risco de regressão), `shared/` guarda as validações
usadas por mais de um formulário. Não há backend neste repositório.

## Complexity Tracking

> Sem violações da constituição: nada a justificar.
