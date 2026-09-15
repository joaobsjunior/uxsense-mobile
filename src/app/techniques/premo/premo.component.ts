import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CheckboxCustomEvent, IonCheckbox, IonItem, IonList } from '@ionic/angular';

import { SerializedAnswer, serialize } from '../technique.types';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

interface Emotion {
  key: string;
  label: string;
  image: string;
}

/** As 14 emoções do PrEmo, com as mesmas figuras do app original. */
const EMOTIONS: Emotion[] = [
  { key: 'desejo', label: 'Desejo', image: '01' },
  { key: 'surpresa_agradavel', label: 'Surpresa Agradável', image: '02' },
  { key: 'interesse', label: 'Interesse', image: '03' },
  { key: 'deleite', label: 'Deleite', image: '04' },
  { key: 'satisfacao', label: 'Satisfação', image: '05' },
  { key: 'admiracao', label: 'Admiração', image: '06' },
  { key: 'fascinio', label: 'Fascínio', image: '07' },
  { key: 'desgosto', label: 'Desgosto', image: '08' },
  { key: 'indignacao', label: 'Indignação', image: '09' },
  { key: 'desprezo', label: 'Desprezo', image: '10' },
  { key: 'surpresa_desagradavel', label: 'Surpresa Desagradável', image: '11' },
  { key: 'insatisfacao', label: 'Insatisfação', image: '12' },
  { key: 'frustracao', label: 'Frustração', image: '13' },
  { key: 'monotonia', label: 'Monotonia', image: '14' },
];

/**
 * Técnica 5 — PrEmo: o aluno marca uma ou mais emoções. Basta uma marcação
 * para a resposta ser válida.
 */
@Component({
  selector: 'app-premo',
  imports: [IonCheckbox, IonItem, IonList, TranslatePipe],
  templateUrl: './premo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremoComponent {
  readonly answerChange = output<SerializedAnswer>();

  readonly emotions = EMOTIONS;

  private readonly values = signal<Record<string, boolean>>(
    Object.fromEntries(EMOTIONS.map((emotion) => [emotion.key, false])),
  );

  isChecked(key: string): boolean {
    return this.values()[key] === true;
  }

  onChange(key: string, event: CheckboxCustomEvent): void {
    const current = { ...this.values(), [key]: event.detail.checked };
    this.values.set(current);

    const anyChecked = Object.values(current).some(Boolean);
    this.answerChange.emit(
      anyChecked ? serialize({ max: true, min: false, type: 'boolean', data: current }) : null,
    );
  }
}
