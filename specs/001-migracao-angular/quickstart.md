# Fase 1 — Quickstart

## Pré-requisitos

- Node `^22.22.3 || ^24.15.0 || >=26.0.0` (exigência do Angular CLI 22)
- Cordova CLI, apenas para gerar os pacotes nativos

## Rodar

```bash
npm install
npm start          # servidor de desenvolvimento em http://localhost:4200
npm run build      # build de produção, gravando em www/
npm test           # testes unitários (Vitest)
```

## Empacotar para o aparelho

O `config.xml` continua lendo `www/`, que agora é saída de build. São dois passos:

```bash
npm run build
cordova build android    # ou: cordova build ios
```

## Verificação da entrega

As três camadas exigidas pela constituição do projeto:

1. **Build**

   ```bash
   npm run build
   ```

2. **Testes**

   ```bash
   npm test
   ```

   Inclui a comparação das 81 células do Affect Grid com a implementação AngularJS
   original, usada como referência dentro do próprio teste.

3. **Fluxo real no navegador**

   Como a API de produção pode não estar acessível a partir do ambiente de
   desenvolvimento, o percurso é feito com as respostas do servidor simuladas. O roteiro
   mínimo:

   - aceitar os termos de uso;
   - tentar entrar com o formulário vazio e com senha curta (as duas mensagens de aviso);
   - entrar e conferir a saudação na home;
   - percorrer as quatro abas e conferir que cada lista carrega;
   - cadastrar uma turma (grupo → subgrupo → time) e pedir a remoção de uma turma;
   - atualizar os dados da conta;
   - responder e enviar cada uma das sete técnicas, conferindo o corpo enviado em
     `POST answer` contra [contracts/techniques.md](./contracts/techniques.md).

   Critério: nenhum erro de JavaScript no console durante todo o percurso.

## Onde mexer

| Quero mudar | Vá para |
|-------------|---------|
| Um texto da interface | `src/app/core/i18n/pt.ts` |
| Uma chamada à API | `src/app/core/api.service.ts` |
| Cabeçalhos, spinner ou tratamento de erro HTTP | `src/app/core/api.interceptor.ts` |
| Sessão, termos, pergunta pendente | `src/app/core/session.service.ts` |
| Acesso a plugin nativo | `src/app/core/device.service.ts` |
| Uma tela | `src/app/pages/<tela>/` |
| O cálculo de uma técnica | `src/app/techniques/<tecnica>/` |
| Cores e tema | `src/theme/` |
