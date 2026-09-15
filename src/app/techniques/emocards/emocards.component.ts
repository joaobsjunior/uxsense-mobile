import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import { SerializedAnswer, serialize } from '../technique.types';

/** Emoção correspondente a cada par de personagens do cartão (T1..T8). */
const EMOTIONS = [
  'excitacao',
  'entusiasmo',
  'prazer',
  'relaxamento',
  'sonolencia',
  'desanimo',
  'desagrado',
  'angustia',
] as const;

/**
 * Técnica 1 — Emocards: o aluno toca no rosto que representa sua emoção.
 * O SVG é o mesmo do app AngularJS; a seleção agora é ligada ao estado do
 * componente em vez de manipulada via jQuery.
 */
@Component({
  selector: 'app-emocards',
  templateUrl: './emocards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmocardsComponent {
  readonly answerChange = output<SerializedAnswer>();

  private readonly selectedId = signal<string | null>(null);

  opacity(id: string): number {
    return this.selectedId() === id ? 0.5 : 0;
  }

  select(id: string): void {
    const next = this.selectedId() === id ? null : id;
    this.selectedId.set(next);
    this.answerChange.emit(next ? this.buildAnswer(next) : null);
  }

  /** O segundo caractere do id (T3M, T3F...) é o número da emoção. */
  private buildAnswer(id: string): SerializedAnswer {
    const index = Number.parseInt(id[1], 10);
    const data: Record<string, number> = {};
    for (const emotion of EMOTIONS) {
      data[emotion] = 0;
    }
    const chosen = EMOTIONS[index - 1];
    if (chosen) {
      data[chosen] = 1;
    }
    return serialize({ max: 1, min: 0, type: 'number', data });
  }
}
