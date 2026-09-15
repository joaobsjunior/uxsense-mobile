# Fase 1 — Modelo de dados

O aplicativo não tem banco próprio: ele exibe o que a API devolve e guarda apenas a sessão
no armazenamento local. As entidades abaixo descrevem o que trafega e o que persiste.

## Entidades da API

### Client (aluno)

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | número | usado como `client_id` no envio da resposta |
| `name` | texto | o primeiro nome aparece na saudação da home |
| `email` | texto | obrigatório no cadastro e na atualização |
| `register` | texto | login; aceita apenas letras, números, ponto e underscore |
| `sex` | texto | `NIL`, `HC`, `MC` ou `IN` |
| `datebirth` | texto ou nulo | `yyyy-MM-dd`; opcional |

### DeviceSession

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | texto | vira o cabeçalho `GSX-DEVICE` |
| `token` | texto | vira o cabeçalho `GSX-TOKEN` |

### Group, Subgroup, Unit, Team

Hierarquia usada para o aluno escolher a turma que acompanha:

```text
Group (id, name)
└── Subgroup (id, name, group)
    └── Team (id, name, subgroup, unit)
Unit (id, name)
```

### Scheduler (pergunta agendada)

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | número | vira `scheduler_id` no envio |
| `question` | `{ id, question }` | enunciado exibido no topo da tela de resposta |
| `team` | Team | exibido como grupo / subgrupo / time |
| `technique` | `{ id }` | decide qual técnica é apresentada |

Identificadores de técnica em uso: 1 (Emocards), 2 (Affect Grid), 3 (PANAS),
4 (AttrakDiff), 5 (PrEmo), 6 (ESM), 8 (SAM). Não existe técnica 7.

### AnswerRecord (histórico)

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | número | |
| `date` | texto | exibido como `dd/MM/yyyy` |
| `time` | texto | `HH:mm` |
| `scheduler` | Scheduler | dá origem ao time, grupo e pergunta exibidos |

## Envio da resposta

Corpo enviado em `POST answer`:

| Campo | Tipo | Origem |
|-------|------|--------|
| `date` | texto `yyyy-MM-dd` | momento do envio |
| `time` | texto `HH:mm` | momento do envio |
| `answer` | **string JSON** | conteúdo da avaliação (ver abaixo) |
| `client_id` | número | aluno autenticado |
| `scheduler_id` | número | pergunta respondida |
| `technique_id` | número | técnica usada |
| `latitude` | número | apenas se a localização estiver disponível |
| `longitude` | número | apenas se a localização estiver disponível |

### Estrutura do campo `answer`

O campo é uma **string** contendo o JSON:

```json
{ "max": 4, "min": 0, "type": "number", "data": { "chave": 0 } }
```

- `type` é `"number"` nas técnicas 1, 2, 3, 4 e 8, e `"boolean"` nas técnicas 5 e 6.
- Em `type: "boolean"`, `max` é `true` e `min` é `false`.
- As chaves de `data`, sua ordem e as faixas de `max`/`min` por técnica estão em
  [contracts/techniques.md](./contracts/techniques.md) e são parte do contrato.

## Estado persistido (localStorage)

| Chave | Conteúdo | Observação |
|-------|----------|-----------|
| `authData` | `{ client, device, authenticated }` | mantém o aluno logado entre aberturas |
| `authHeader` | `{ "GSX-DEVICE", "GSX-TOKEN" }` | enviado em toda requisição |
| `terms` | `{ "1.0": true }` | aceite por versão de termos |

As três chaves são as mesmas da versão AngularJS: a atualização do app não pode deslogar
quem já usa nem pedir o aceite dos termos de novo.

## Estado apenas em memória

| Estado | Uso |
|--------|-----|
| `notification` | pergunta pendente, entre o aviso e o envio da resposta |
| `location` | coordenadas capturadas ao abrir a tela de resposta |
| `tokenFCM` | último token de push conhecido, para evitar reenviar igual |
| `isSended` / `checkingQuestions` | evitam consultas simultâneas ou repetidas ao servidor |
