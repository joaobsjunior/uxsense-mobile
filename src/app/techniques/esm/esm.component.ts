import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import { SerializedAnswer, serialize } from '../technique.types';

interface Option {
  key: string;
  label: string;
  image: string;
}

/** Os cinco níveis de satisfação do ESM, na ordem do app original. */
const OPTIONS: Option[] = [
  { key: 'muito_satisfeito', label: 'Muito satisfeito', image: 'esm-01' },
  { key: 'satisfeito', label: 'Satisfeito', image: 'esm-02' },
  { key: 'indiferente', label: 'Indiferente', image: 'esm-03' },
  { key: 'insatisfeito', label: 'Insatisfeito', image: 'esm-04' },
  { key: 'muito_insatisfeito', label: 'Muito insatisfeito', image: 'esm-05' },
];

/** Técnica 6 — ESM: escolha única entre cinco emojis de satisfação. */
@Component({
  selector: 'app-esm',
  imports: [],
  templateUrl: './esm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsmComponent {
  readonly answerChange = output<SerializedAnswer>();

  readonly options = OPTIONS;

  private readonly selectedKey = signal<string | null>(null);

  isSelected(key: string): boolean {
    return this.selectedKey() === key;
  }

  select(key: string): void {
    this.selectedKey.set(key);

    const data = Object.fromEntries(OPTIONS.map((option) => [option.key, option.key === key]));
    this.answerChange.emit(serialize({ max: true, min: false, type: 'boolean', data }));
  }
}
