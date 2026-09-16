import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { PanasComponent } from './panas.component';

/**
 * Chaves que o app AngularJS enviava (o rótulo exibido, em minúsculas).
 * Elas fazem parte do contrato com o servidor e são travadas aqui para que
 * uma mudança de texto na interface não as altere sem querer.
 */
const CONTRACT_KEYS = [
  'ativo',
  'interessado',
  'empolgado',
  'forte',
  'entusiasmado',
  'orgulhoso',
  'inspirado',
  'determinado',
  'atento',
  'alerta',
  'aflito',
  'chateado',
  'culpado',
  'apavorado',
  'hostil',
  'irritável',
  'commedo',
  'envergonhado',
  'nervoso',
  'inquieto',
];

describe('PanasComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PanasComponent] });
  });

  function createComponent() {
    const fixture = TestBed.createComponent(PanasComponent);
    const emitted: (string | null)[] = [];
    fixture.componentInstance.answerChange.subscribe((value) => emitted.push(value));
    return { component: fixture.componentInstance, emitted };
  }

  it('mantém as 20 chaves do contrato, na mesma ordem', () => {
    const { component } = createComponent();
    expect(component.feelings.map((feeling) => feeling.key)).toEqual(CONTRACT_KEYS);
  });

  it('só envia a resposta quando os 20 sentimentos recebem nota', () => {
    const { component, emitted } = createComponent();

    for (const feeling of component.feelings.slice(0, 19)) {
      component.select(feeling, 3);
    }
    expect(emitted.at(-1)).toBeNull();

    component.select(component.feelings[19], 5);
    const answer = JSON.parse(emitted.at(-1) as string);
    expect(answer.max).toBe(5);
    expect(answer.min).toBe(1);
    expect(answer.type).toBe('number');
    expect(Object.keys(answer.data)).toEqual(CONTRACT_KEYS);
    expect(answer.data['inquieto']).toBe(5);
  });

  it('desmarca a nota ao tocar de novo na mesma opção', () => {
    const { component, emitted } = createComponent();
    const feeling = component.feelings[0];

    component.select(feeling, 4);
    expect(component.isSelected(feeling, 4)).toBe(true);

    component.select(feeling, 4);
    expect(component.isSelected(feeling, 4)).toBe(false);
    expect(component.isMissing(feeling)).toBe(true);
    expect(emitted.at(-1)).toBeNull();
  });
});
