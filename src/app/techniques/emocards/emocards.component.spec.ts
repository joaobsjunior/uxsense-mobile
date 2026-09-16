import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { EmocardsComponent } from './emocards.component';

describe('EmocardsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EmocardsComponent] });
  });

  function createComponent() {
    const fixture = TestBed.createComponent(EmocardsComponent);
    const emitted: (string | null)[] = [];
    fixture.componentInstance.answerChange.subscribe((value) => emitted.push(value));
    return { component: fixture.componentInstance, emitted };
  }

  const EXPECTED: Record<string, string> = {
    T1M: 'excitacao',
    T2F: 'entusiasmo',
    T3M: 'prazer',
    T4F: 'relaxamento',
    T5M: 'sonolencia',
    T6F: 'desanimo',
    T7M: 'desagrado',
    T8F: 'angustia',
  };

  it('marca a emoção correspondente ao personagem escolhido', () => {
    for (const [id, emotion] of Object.entries(EXPECTED)) {
      const { component, emitted } = createComponent();
      component.select(id);

      const answer = JSON.parse(emitted.at(-1) as string);
      expect(answer).toEqual({
        max: 1,
        min: 0,
        type: 'number',
        data: {
          excitacao: 0,
          entusiasmo: 0,
          prazer: 0,
          relaxamento: 0,
          sonolencia: 0,
          desanimo: 0,
          desagrado: 0,
          angustia: 0,
          [emotion]: 1,
        },
      });
    }
  });

  it('desmarca ao tocar duas vezes no mesmo personagem', () => {
    const { component, emitted } = createComponent();

    component.select('T3M');
    expect(component.opacity('T3M')).toBe(0.5);

    component.select('T3M');
    expect(component.opacity('T3M')).toBe(0);
    expect(emitted.at(-1)).toBeNull();
  });
});
