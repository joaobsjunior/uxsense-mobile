# Fase 0 — Pesquisa e decisões

Registro das perguntas em aberto no início do planejamento, do que foi apurado e da
decisão tomada. Cada decisão aponta a alternativa descartada e o motivo.

## 1. Qual é a "última versão estável do Angular"?

**Apurado**: no registro npm, `@angular/core` está em **22.1.6** e `@angular/cli` em
**22.1.8**. O AngularJS (linha 1.x) terminou o suporte em janeiro de 2022 e não tem
caminho de atualização direto para o Angular moderno: são frameworks diferentes, então a
migração é uma reescrita.

**Decisão**: Angular 22.1.

**Alternativa descartada**: atualização incremental com `ngUpgrade`, rodando AngularJS e
Angular lado a lado. Descartada porque exigiria manter as duas árvores de dependências
(inclusive as versionadas via bower, que são a origem das vulnerabilidades) durante toda a
transição, para um app de 11 telas em que a reescrita completa é menor que a convivência.

## 2. O Ionic v1 tem sucessor compatível com Angular 22?

**Apurado**: `@ionic/angular` está em **9.0.3** e declara compatibilidade com Angular
`>=18`. O pacote expõe componentes standalone diretamente na raiz, sem necessidade de
NgModule.

**Decisão**: Ionic 9 como camada de interface.

**Alternativa descartada**: Angular puro com CSS próprio. Descartada porque obrigaria a
reconstruir abas, listas, campos com rótulo flutuante, popups, indicador de carregamento e
"puxar para atualizar" — comportamento móvel que o Ionic entrega pronto e que o app já
usava.

## 3. O app roda sem zone.js?

**Apurado**: projetos novos do Angular 22 não incluem `zone.js`; a detecção de mudanças
zoneless é o padrão. O Ionic dá suporte a esse modo desde a versão 8.4.

**Decisão**: manter o padrão zoneless. Como consequência, todo estado que a tela lê e que
chega de callback assíncrono (resposta HTTP, retorno de plugin nativo) MUST ficar em
signal; formulários usam Reactive Forms, cujo fluxo de atualização não depende de zone.

**Alternativa descartada**: reintroduzir `zone.js` para simplificar a escrita. Descartada
por adicionar dependência e sobrecarga que o framework já removeu, e por esconder erros de
modelagem de estado que apareceriam depois.

## 4. Qual versão de Node o build exige?

**Apurado**: o Angular CLI 22 exige Node `^22.22.3 || ^24.15.0 || >=26.0.0` e recusa
versões abaixo disso — inclusive 22.22.2, por um patch de diferença.

**Decisão**: declarar a faixa em `engines` e no README, e usar Node 24 LTS na verificação.

**Alternativa descartada**: fixar o projeto em Angular 21 para acomodar o Node instalado.
Descartada por contrariar o pedido de última versão estável, por um obstáculo que se
resolve atualizando o Node.

## 5. Como o Cordova continua encontrando o pacote?

**Apurado**: o `config.xml` aponta `<content src="index.html" />` e o Cordova copia a pasta
`www/` para o aparelho. O Angular CLI aceita `outputPath` com base e subpasta separadas, o
que permite gravar direto em `www/` sem subpasta intermediária.

**Decisão**: `outputPath: { base: "www", browser: "" }` e `baseHref: "./"`. O `config.xml`
não muda; `www/` deixa de ser fonte e passa a ser saída de build, entrando no `.gitignore`.

**Alternativa descartada**: usar `@ionic/cordova-builders`. Descartada porque esse pacote
exige o builder antigo baseado em webpack (`@angular-devkit/build-angular`), enquanto o
projeto usa o builder atual com esbuild; ele traria dependências a mais para resolver um
problema que uma linha de configuração resolve.

## 6. Rotas com hash ou caminhos limpos?

**Apurado**: dentro do Cordova o app é servido por `file://`, onde não existe servidor para
reescrever caminhos. O app antigo usava `#/rota`.

**Decisão**: `withHashLocation()`, mantendo o formato `#/rota`.

**Alternativa descartada**: `PathLocationStrategy`. Descartada porque quebra ao recarregar
e ao navegar direto em ambiente `file://`.

## 7. O que substitui angular-translate?

**Apurado**: o app usa apenas tradução por chave, em um único idioma, com um dicionário de
pouco mais de 90 entradas e nenhuma interpolação de parâmetros. Bibliotecas equivalentes no
Angular moderno (como ngx-translate) resolvem carregamento assíncrono, múltiplos idiomas e
interpolação — nada disso é usado aqui.

**Decisão**: um serviço de tradução próprio com um pipe `translate`, replicando a API de
consulta por chave e o comportamento de devolver a própria chave quando ela não existe.

**Alternativa descartada**: adotar ngx-translate. Descartada por acrescentar dependência
(e superfície de auditoria) para um recurso de vinte linhas, com risco de atraso de
compatibilidade a cada versão nova do Angular.

## 8. O que fazer com jQuery e angular-input-masks?

**Apurado**: o jQuery era usado somente para manipular atributos do SVG das técnicas e
classes de validação. As máscaras de entrada estavam declaradas como dependência, mas
nenhuma diretiva de máscara aparece nos templates.

**Decisão**: remover ambos. A seleção nas técnicas passa a ser estado do componente, ligado
ao atributo `fill-opacity` por binding.

**Alternativa descartada**: manter jQuery para reaproveitar a manipulação existente.
Descartada porque misturar manipulação direta do DOM com renderização do framework é a
origem de bugs difíceis e impede testar a lógica sem navegador.

## 9. Como garantir que as técnicas continuam enviando os mesmos valores?

**Apurado**: o cálculo mais sensível é o do Affect Grid, que converte a célula escolhida em
oito dimensões afetivas com regras assimétricas por quadrante; as demais técnicas são
mapeamentos diretos. Um erro aqui corrompe dados de pesquisa em silêncio.

**Decisão**: portar o cálculo preservando ordem das chaves e faixas, e escrever teste que
executa as 81 células comparando com a implementação original copiada como referência
dentro do próprio teste.

**Alternativa descartada**: conferência manual por amostragem. Descartada porque os
quadrantes têm regras diferentes e a amostra deixaria combinações sem cobertura.

## 10. Como zerar as vulnerabilidades e mantê-las zeradas?

**Apurado**: a auditoria do projeto antigo vinha da cadeia de ferramentas de build (gulp 4,
node-sass, bower) e de bibliotecas de front-end versionadas dentro do repositório, que a
auditoria sequer enxergava. O `package-lock.json` estava no `.gitignore`.

**Decisão**: a cadeia de build passa a ser a do Angular CLI, as bibliotecas de front-end
viram dependências npm resolvidas no build, e o `package-lock.json` passa a ser versionado
para que a instalação seja reprodutível e a auditoria signifique algo.

**Alternativa descartada**: aplicar `overrides` para silenciar avisos mantendo as
ferramentas antigas. Descartada porque foi o remendo da etapa anterior; a migração remove a
causa.

## 11. Comportamentos do app antigo que não devem ser reproduzidos

Dois pontos apareceram na leitura do código e não são "paridade" a preservar, e sim defeitos:

1. **Busca de pergunta pendente em laço fechado**: no tratamento de erro, a função chamava
   a si mesma imediatamente, sem pausa nem limite. Com o servidor fora do ar isso vira uma
   sequência ininterrupta de requisições. **Decisão**: espera entre tentativas e limite de
   tentativas.
2. **Registro do tratamento de push só ao aceitar os termos**: como o aceite acontece uma
   única vez na vida do app, depois de reiniciar ninguém registrava o tratador de
   notificação. **Decisão**: registrar também na abertura do app quando os termos já foram
   aceitos.

Ambos estão registrados como requisitos na especificação (FR-012) e como tarefas próprias.
