# Contrato — API do UXSense

Base: `http://api.uxsense.com.br/api/app/`

Todas as requisições enviam `Content-Type: application/json` e, quando há sessão, os
cabeçalhos `GSX-DEVICE` e `GSX-TOKEN`. Requisições sem resposta em 30 segundos são tratadas
como indisponibilidade do servidor.

Esta tabela é o contrato herdado da versão AngularJS e não pode mudar na migração.

| # | Verbo | Caminho | Parâmetros | Carrega spinner | Usado em |
|---|-------|---------|-----------|-----------------|----------|
| 1 | POST | `login` | credenciais + dados do aparelho + `registrator_id` | sim | Login |
| 2 | POST | `signup` | dados do cadastro | sim | Cadastro |
| 3 | POST | `lost-password` | `email` | sim | Recuperar senha |
| 4 | POST | `client` | dados da conta (+ senhas, se houver troca) | sim | Minha conta |
| 5 | POST | `update-registration` | `registration_id` | sim | Renovação do token de push |
| 6 | GET | `logout` | — | sim | Minha conta |
| 7 | GET | `group` | — | sim | Nova turma |
| 8 | GET | `subgroup/{idGroup}` | — | sim | Nova turma |
| 9 | GET | `team/{idSubgroup}` | `subgroup=true` | sim | Nova turma |
| 10 | GET | `team/{idClient}` | `client=true` | conforme a origem | Times |
| 11 | POST | `team-client` | `client`, `team` | sim | Nova turma |
| 12 | DELETE | `team-client` | `client`, `team` (query) | sim | Times |
| 13 | GET | `answer` | — | conforme a origem | Respostas |
| 14 | POST | `answer` | ver data-model | sim | Envio da resposta |
| 15 | GET | `scheduler` | — | **não** | Verificação de pergunta pendente |

Observações que fazem parte do comportamento:

- Em `GET` e `DELETE` os parâmetros vão na query string; nos demais, no corpo.
- A chamada 15 roda em segundo plano: não mostra spinner nem popup de erro.
- A chamada 10 e a 13 recebem o controle de spinner de quem chamou, porque também são
  disparadas pelo gesto de "puxar para atualizar", que tem indicador próprio.

## Tratamento de erro

| Situação | Mensagem exibida (chave) | Efeito |
|----------|--------------------------|--------|
| Sem resposta / timeout / rede | `server-timeout` | popup, quando a chamada exibe spinner |
| 203, 400, 404, 412, 500 | `server-error{status}` | popup, quando a chamada exibe spinner |
| 401 | `server-error401` | popup, limpa a sessão e volta ao login |

Chamadas marcadas como silenciosas não exibem popup: quem chamou decide o que fazer.
