import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { IonItem, IonItemDivider, IonLabel, IonList, IonRange, RangeCustomEvent } from '@ionic/angular';

import { SerializedAnswer, serialize } from '../technique.types';

interface Pair {
  key: string;
  left: string;
  right: string;
}

interface Dimension {
  title: string;
  pairs: Pair[];
}

/** Pares semânticos do AttrakDiff, na mesma ordem do template original. */
const DIMENSIONS: Dimension[] = [
  {
    title: 'Identidade',
    pairs: [
      { key: 'conectivo', left: 'Isolador', right: 'Conectivo' },
      { key: 'profissional', left: 'Não profissional', right: 'Profissional' },
      { key: 'elegante', left: 'Desalinhado', right: 'Elegante' },
      { key: 'superior', left: 'Inferior', right: 'Superior' },
      { key: 'integrador', left: 'Alienador', right: 'Integrador' },
      { key: 'meaproxima', left: 'Me afasta', right: 'Me aproxima' },
      { key: 'apresentavel', left: 'Não apresentável', right: 'Apresentável' },
    ],
  },
  {
    title: 'Estímulo',
    pairs: [
      { key: 'inventivo', left: 'Convencional', right: 'Inventivo' },
      { key: 'criativo', left: 'Sem imaginação', right: 'Criativo' },
      { key: 'ousado', left: 'Cauteloso', right: 'Ousado' },
      { key: 'inovador', left: 'Conservador', right: 'Inovador' },
      { key: 'cativante', left: 'Entediante', right: 'Cativante' },
      { key: 'desafiador', left: 'Pouco exigente', right: 'Desafiador' },
      { key: 'unico', left: 'Comum', right: 'Único' },
    ],
  },
];

const TOTAL_PAIRS = DIMENSIONS.reduce((total, dimension) => total + dimension.pairs.length, 0);

/**
 * Técnica 4 — AttrakDiff: 14 escalas de 0 a 6. Como no app original, cada
 * escala só conta depois de ser movida pelo aluno.
 */
@Component({
  selector: 'app-attrakdiff',
  imports: [IonItem, IonItemDivider, IonLabel, IonList, IonRange],
  templateUrl: './attrakdiff.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttrakdiffComponent {
  readonly submitted = input(false);
  readonly answerChange = output<SerializedAnswer>();

  readonly dimensions = DIMENSIONS;

  private readonly values = signal<Record<string, number>>({});

  isMissing(key: string): boolean {
    return this.values()[key] === undefined;
  }

  onChange(key: string, event: RangeCustomEvent): void {
    const value = event.detail.value;
    if (typeof value !== 'number') {
      return;
    }
    const current = { ...this.values(), [key]: value };
    this.values.set(current);

    const complete = Object.keys(current).length === TOTAL_PAIRS;
    this.answerChange.emit(
      complete ? serialize({ max: 6, min: 0, type: 'number', data: current }) : null,
    );
  }
}
