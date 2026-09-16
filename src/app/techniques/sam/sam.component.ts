import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { IonItem, IonItemDivider, IonLabel, IonList, IonRange, RangeCustomEvent } from '@ionic/angular';

import { SerializedAnswer, serialize } from '../technique.types';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

interface Dimension {
  key: string;
  label: string;
  image: string;
}

/** As três dimensões do SAM, com as figuras do app original. */
const DIMENSIONS: Dimension[] = [
  { key: 'prazer', label: 'Prazer', image: 'sam-01' },
  { key: 'excitacao', label: 'Excitação', image: 'sam-02' },
  { key: 'dominancia', label: 'Dominância', image: 'sam-03' },
];

/**
 * Técnica 8 — SAM: três escalas de 0 a 8 (exibidas de 1 a 9). A resposta
 * exige que as três sejam informadas.
 */
@Component({
  selector: 'app-sam',
  imports: [IonItem, IonItemDivider, IonLabel, IonList, IonRange, TranslatePipe],
  templateUrl: './sam.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamComponent {
  readonly submitted = input(false);
  readonly answerChange = output<SerializedAnswer>();

  readonly dimensions = DIMENSIONS;

  private readonly values = signal<Record<string, number>>({});

  isMissing(key: string): boolean {
    return this.values()[key] === undefined;
  }

  /** Mostra o valor começando em 1, como o getNumber(valor, 1) original. */
  displayValue(key: string): number | null {
    const value = this.values()[key];
    return value === undefined ? null : value + 1;
  }

  onChange(key: string, event: RangeCustomEvent): void {
    const value = event.detail.value;
    if (typeof value !== 'number') {
      return;
    }
    const current = { ...this.values(), [key]: value };
    this.values.set(current);

    const complete = Object.keys(current).length === DIMENSIONS.length;
    this.answerChange.emit(
      complete ? serialize({ max: 8, min: 0, type: 'number', data: current }) : null,
    );
  }
}
