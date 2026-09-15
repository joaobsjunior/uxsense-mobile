import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { SerializedAnswer, serialize } from '../technique.types';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

interface Feeling {
  /** Chave enviada à API. Faz parte do contrato: não pode mudar. */
  key: string;
  /** Texto exibido ao aluno. */
  label: string;
}

/**
 * Os 20 sentimentos da escala PANAS, na ordem do app original.
 *
 * A chave é declarada junto do rótulo, e não derivada dele: assim o que o
 * servidor recebe não depende da redação da interface. As chaves reproduzem
 * exatamente as que o app AngularJS enviava, inclusive o acento de "irritável"
 * e a grafia herdada "commedo".
 */
const FEELINGS: Feeling[] = [
  { key: 'ativo', label: 'Ativo' },
  { key: 'interessado', label: 'Interessado' },
  { key: 'empolgado', label: 'Empolgado' },
  { key: 'forte', label: 'Forte' },
  { key: 'entusiasmado', label: 'Entusiasmado' },
  { key: 'orgulhoso', label: 'Orgulhoso' },
  { key: 'inspirado', label: 'Inspirado' },
  { key: 'determinado', label: 'Determinado' },
  { key: 'atento', label: 'Atento' },
  { key: 'alerta', label: 'Alerta' },
  { key: 'aflito', label: 'Aflito' },
  { key: 'chateado', label: 'Chateado' },
  { key: 'culpado', label: 'Culpado' },
  { key: 'apavorado', label: 'Apavorado' },
  { key: 'hostil', label: 'Hostil' },
  { key: 'irritável', label: 'Irritável' },
  { key: 'commedo', label: 'Commedo' },
  { key: 'envergonhado', label: 'Envergonhado' },
  { key: 'nervoso', label: 'Nervoso' },
  { key: 'inquieto', label: 'Inquieto' },
];

const SCORES = [1, 2, 3, 4, 5];

/**
 * Técnica 3 — PANAS: uma nota de 1 a 5 para cada sentimento. A resposta só
 * fica completa quando todos os 20 sentimentos recebem nota.
 */
@Component({
  selector: 'app-panas',
  imports: [TranslatePipe],
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

  isSelected(feeling: Feeling, score: number): boolean {
    return this.values()[feeling.key] === score;
  }

  isMissing(feeling: Feeling): boolean {
    return this.values()[feeling.key] === undefined;
  }

  select(feeling: Feeling, score: number): void {
    const current = { ...this.values() };
    if (current[feeling.key] === score) {
      delete current[feeling.key];
    } else {
      current[feeling.key] = score;
    }
    this.values.set(current);

    const complete = Object.keys(current).length === FEELINGS.length;
    this.answerChange.emit(
      complete ? serialize({ max: 5, min: 1, type: 'number', data: current }) : null,
    );
  }
}
