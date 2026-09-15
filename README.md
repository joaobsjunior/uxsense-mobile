# uxsense-mobile

Aplicativo híbrido (Ionic v1 + AngularJS 1.8.3 + Cordova).

## Requisitos

- Node.js >= 18
- Ionic CLI (`npm i -g @ionic/cli`) para `ionic serve` / `ionic cordova build`

## Desenvolvimento

```bash
npm install        # ferramentas de build (gulp, sass, @ionic/v1-toolkit)
npm run build      # compila scss -> www/css, concatena controllers e libs -> www/js
npm run watch      # recompila ao salvar scss/controllers
ionic serve        # servidor de desenvolvimento (executa `gulp ionic:serve:before`)
```

As bibliotecas de front-end (Ionic, AngularJS, ui-router, angular-translate, angular-input-masks,
angular-i18n, jQuery) ficam versionadas em `www/lib`; as versões estão listadas em `bower.json`.
