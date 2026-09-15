# UXSense

Aplicativo móvel do UXSense: captura a experiência de usuário (UX) de alunos por
meio de perguntas enviadas periodicamente por notificação.

Construído com **Angular 22 + Ionic 9** e empacotado para Android/iOS com **Cordova**.

## Requisitos

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` (exigência do Angular CLI 22)
- Cordova CLI, apenas para gerar os pacotes nativos

## Como rodar

```bash
npm install
npm start          # servidor de desenvolvimento em http://localhost:4200
npm run build      # build de produção direto na pasta www/
npm test           # testes unitários (Vitest)
```

O `ng build` grava a saída em `www/`, que é a pasta declarada no `config.xml`.
Por isso o build nativo é sempre feito em dois passos:

```bash
npm run build
cordova build android    # ou: cordova build ios
```

A pasta `www/` é gerada pelo build e não é versionada.

## Estrutura

```
src/
  app/
    core/         Serviços compartilhados: sessão, API, diálogos, i18n, recursos nativos
    pages/        Telas (termo, login, cadastro, abas, times, respostas, minha conta...)
    techniques/   As sete técnicas de avaliação de UX aplicadas nas perguntas
    shared/       Validações reutilizadas pelos formulários
  assets/img/     Figuras das técnicas (PrEmo, SAM e ESM)
  theme/          Paleta e variáveis de tema do Ionic
```

### Técnicas de avaliação

Cada pergunta chega com o identificador da técnica que deve ser usada na resposta:

| ID | Técnica     | Formato da resposta                        |
| -- | ----------- | ------------------------------------------ |
| 1  | Emocards    | uma emoção entre oito                      |
| 2  | Affect Grid | célula de uma matriz 9x9 (oito dimensões)  |
| 3  | PANAS       | nota de 1 a 5 para 20 sentimentos          |
| 4  | AttrakDiff  | 14 escalas de 0 a 6                        |
| 5  | PrEmo       | uma ou mais emoções entre catorze          |
| 6  | ESM         | um nível de satisfação entre cinco         |
| 8  | SAM         | três escalas de 0 a 8                      |

A resposta é enviada à API no campo `answer`, como uma string JSON no formato
`{ max, min, type, data }` — o mesmo contrato usado desde a versão AngularJS.

## API

O app consome `http://api.uxsense.com.br/api/app/`. A sessão é mantida pelos
cabeçalhos `GSX-DEVICE` e `GSX-TOKEN`, guardados em `localStorage`.
