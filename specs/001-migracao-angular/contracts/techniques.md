# Contrato — Técnicas de avaliação

O campo `answer` enviado ao servidor é uma string JSON no formato
`{ max, min, type, data }`. Esta página fixa, por técnica, as chaves de `data`, a ordem em
que aparecem, as faixas e a condição para a resposta ser considerada completa.

Nada aqui pode mudar na migração: dados já coletados são comparados com os novos.

## 1 — Emocards

- `max: 1`, `min: 0`, `type: "number"`
- Interação: toca em um dos 16 personagens do cartão (8 emoções × 2 personagens)
- Chaves, nesta ordem: `excitacao`, `entusiasmo`, `prazer`, `relaxamento`, `sonolencia`,
  `desanimo`, `desagrado`, `angustia`
- A emoção escolhida recebe `1`; as demais, `0`
- Tocar de novo no mesmo personagem desmarca e invalida a resposta
- Completa com uma escolha

## 2 — Affect Grid

- `max: 4`, `min: 0`, `type: "number"`
- Interação: toca em uma das 81 células de uma matriz 9×9
- Chaves, nesta ordem: `agradavel`, `excitacao`, `alta_excitacao`, `estresse`,
  `desagradavel`, `depressao`, `sonolencia`, `relaxamento`
- Cada valor sai do cálculo por quadrante descrito abaixo, com uma casa decimal e nunca
  negativo
- Completa com uma escolha

Cálculo, a partir do índice da célula (1 a 81, em ordem de leitura):

```text
linha   = teto(indice / 9) - 1
coluna  = (arredonda((indice / 9 - piso(indice / 9)) * 9) ou 9) - 1
```

Cada dimensão combina dois eixos e devolve a média deles. Quando a célula está fora do
quadrante da dimensão, os dois eixos são zerados antes da média. Quatro dimensões
(`agradavel`, `alta_excitacao`, `desagradavel`, `sonolencia`) medem o segundo eixo pela
distância ao centro na direção perpendicular, com o desconto `(8 - eixo) - 4` no lado
inferior da matriz.

A conferência dessa regra é feita por teste automatizado que percorre as 81 células
comparando com a implementação original.

## 3 — PANAS

- `max: 5`, `min: 1`, `type: "number"`
- Interação: nota de 1 a 5 para cada um dos 20 sentimentos
- Chaves: o nome do sentimento em minúsculas, preservando acento —
  `ativo`, `interessado`, `empolgado`, `forte`, `entusiasmado`, `orgulhoso`, `inspirado`,
  `determinado`, `atento`, `alerta`, `aflito`, `chateado`, `culpado`, `apavorado`,
  `hostil`, `irritável`, `commedo`, `envergonhado`, `nervoso`, `inquieto`
- **Completa somente com os 20 sentimentos avaliados**; linhas sem nota ficam destacadas
  depois da tentativa de envio
- A chave é declarada junto do rótulo no componente, nunca derivada do texto exibido: a
  redação da interface não pode alterar o que o servidor recebe

## 4 — AttrakDiff

- `max: 6`, `min: 0`, `type: "number"`
- Interação: 14 escalas de 0 a 6, exibidas em dois grupos (Identidade e Estímulo)
- Chaves, nesta ordem: `conectivo`, `profissional`, `elegante`, `superior`, `integrador`,
  `meaproxima`, `apresentavel`, `inventivo`, `criativo`, `ousado`, `inovador`, `cativante`,
  `desafiador`, `unico`
- A escala começa visualmente no meio, mas só conta depois de ser movida pelo aluno
- **Completa somente com as 14 escalas movidas**

## 5 — PrEmo

- `max: true`, `min: false`, `type: "boolean"`
- Interação: marca uma ou mais emoções, entre 14, cada uma com sua figura
- Chaves, nesta ordem: `desejo`, `surpresa_agradavel`, `interesse`, `deleite`, `satisfacao`,
  `admiracao`, `fascinio`, `desgosto`, `indignacao`, `desprezo`, `surpresa_desagradavel`,
  `insatisfacao`, `frustracao`, `monotonia`
- Todas as 14 chaves são enviadas, com `true` nas marcadas e `false` nas demais
- Completa com pelo menos uma marcada

## 6 — ESM

- `max: true`, `min: false`, `type: "boolean"`
- Interação: escolhe um entre cinco níveis de satisfação, representados por emojis
- Chaves, nesta ordem: `muito_satisfeito`, `satisfeito`, `indiferente`, `insatisfeito`,
  `muito_insatisfeito`
- A escolhida vai como `true` e as outras como `false`
- Completa com a escolha

## 8 — SAM

- `max: 8`, `min: 0`, `type: "number"`
- Interação: três escalas de 0 a 8, exibidas ao aluno como 1 a 9
- Chaves, nesta ordem: `prazer`, `excitacao`, `dominancia`
- **Completa somente com as três escalas informadas**
