import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import { SerializedAnswer, serialize } from '../technique.types';

const MAX = 4;
const COLUMNS = 9;

/**
 * Técnica 2 — Affect Grid: matriz 9x9 onde a célula escolhida é convertida
 * em oito dimensões afetivas. O cálculo é o mesmo do AnswerSendController do
 * app AngularJS, para que o servidor continue recebendo os mesmos valores.
 */
@Component({
  selector: 'app-affect-grid',
  templateUrl: './affect-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffectGridComponent {
  readonly answerChange = output<SerializedAnswer>();

  private readonly selectedCell = signal<number | null>(null);

  opacity(cell: number): number {
    return this.selectedCell() === cell ? 0.5 : 0;
  }

  select(cell: number): void {
    const next = this.selectedCell() === cell ? null : cell;
    this.selectedCell.set(next);
    this.answerChange.emit(next ? this.buildAnswer(next) : null);
  }

  private buildAnswer(cell: number): SerializedAnswer {
    const line = Math.ceil(cell / COLUMNS) - 1;
    const column = (Math.round((cell / COLUMNS - Math.floor(cell / COLUMNS)) * COLUMNS) || COLUMNS) - 1;

    return serialize({
      max: MAX,
      min: 0,
      type: 'number',
      data: {
        agradavel: diagonal(column < MAX ? 0 : column - MAX, line, column < MAX),
        excitacao: average(
          line > MAX || column < MAX ? 0 : MAX - line,
          line > MAX || column < MAX ? 0 : column - MAX,
        ),
        alta_excitacao: diagonalByColumn(line > MAX ? 0 : MAX - line, column, line > MAX),
        estresse: average(
          line > MAX || column > MAX ? 0 : MAX - line,
          line > MAX || column > MAX ? 0 : MAX - column,
        ),
        desagradavel: diagonal(column > MAX ? 0 : MAX - column, line, column > MAX),
        depressao: average(
          line < MAX || column > MAX ? 0 : line - MAX,
          line < MAX || column > MAX ? 0 : MAX - column,
        ),
        sonolencia: diagonalByColumn(line < MAX ? 0 : line - MAX, column, line < MAX),
        relaxamento: average(
          line < MAX || column < MAX ? 0 : line - MAX,
          line < MAX || column < MAX ? 0 : column - MAX,
        ),
      },
    });
  }
}

/** Média dos dois eixos, arredondada em uma casa e nunca negativa. */
function average(first: number, second: number): number {
  const value = Number.parseFloat(((first + second) / 2).toFixed(1));
  return value < 0 ? 0 : value;
}

/** Dimensões cujo segundo eixo é medido pela distância da linha ao centro. */
function diagonal(base: number, line: number, reset: boolean): number {
  let first = base;
  let second: number;
  if (line === MAX) {
    second = first;
  } else if (line > MAX) {
    second = first - (line - MAX);
  } else {
    second = first - (COLUMNS - 1 - line - MAX);
  }
  if (reset || second < -1) {
    first = 0;
    second = 0;
  }
  return average(first, second);
}

/** Mesma ideia da anterior, medindo a distância da coluna ao centro. */
function diagonalByColumn(base: number, column: number, reset: boolean): number {
  let first = base;
  let second: number;
  if (column === MAX) {
    second = first;
  } else if (column > MAX) {
    second = first - (column - MAX);
  } else {
    second = first - (COLUMNS - 1 - column - MAX);
  }
  if (reset || second < -1) {
    first = 0;
    second = 0;
  }
  return average(first, second);
}
