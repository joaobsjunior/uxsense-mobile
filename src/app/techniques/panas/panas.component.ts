import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { SerializedAnswer, serialize } from '../technique.types';

/** Os 20 sentimentos avaliados na escala PANAS, na ordem do app original. */
const FEELINGS = [
  'Ativo',
  'Interessado',
  'Empolgado',
  'Forte',
  'Entusiasmado',
  'Orgulhoso',
  'Inspirado',
  'Determinado',
  'Atento',
  'Alerta',
  'Aflito',
  'Chateado',
  'Culpado',
  'Apavorado',
  'Hostil',
  'Irritável',
  'Commedo',
  'Envergonhado',
  'Nervoso',
  'Inquieto',
];

const SCORES = [1, 2, 3, 4, 5];

/**
 * Técnica 3 — PANAS: uma nota de 1 a 5 para cada sentimento. A resposta só
 * fica completa quando todos os 20 sentimentos recebem nota.
 */
@Component({
  selector: 'app-panas',
  imports: [],
  templateUrl: './panas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanasComponent {
  /** Depois de tentar enviar, as linhas sem nota ficam destacadas. */
  readonly submitted = input(false);
  readonly answerChange = output<SerializedAnswer>();

  readonly feelings = FEELINGS;
  readonly scores = SCORES;

  private readonly values = signal<Record<string, number>>({});

  key(feeling: string): string {
    return feeling.toLowerCase();
  }

  isSelected(feeling: string, score: number): boolean {
    return this.values()[this.key(feeling)] === score;
  }

  isMissing(feeling: string): boolean {
    return this.values()[this.key(feeling)] === undefined;
  }

  select(feeling: string, score: number): void {
    const key = this.key(feeling);
    const current = { ...this.values() };
    if (current[key] === score) {
      delete current[key];
    } else {
      current[key] = score;
    }
    this.values.set(current);

    const complete = Object.keys(current).length === FEELINGS.length;
    this.answerChange.emit(
      complete ? serialize({ max: 5, min: 1, type: 'number', data: current }) : null,
    );
  }
}
