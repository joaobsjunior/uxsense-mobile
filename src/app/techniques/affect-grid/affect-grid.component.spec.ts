import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { AffectGridComponent } from './affect-grid.component';

/**
 * Implementação de referência: é o cálculo original do AnswerSendController
 * (AngularJS) copiado sem alterações. O teste compara célula a célula para
 * garantir que a migração não mudou nenhum valor enviado ao servidor.
 */
function legacyAnswer(index: number): Record<string, number> {
  const answer = { max: 4, min: 0 };
  let line = Math.ceil(index / 9);
  let column = Math.round((index / 9 - Math.floor(index / 9)) * 9) || 9;
  line--;
  column--;

  return {
    agradavel: ((l: number, c: number) => {
      let _line = c < 4 ? 0 : c - answer.max;
      let _column: number;
      if (l === 4) {
        _column = _line;
      } else if (l > 4) {
        _column = _line - (l - 4);
      } else {
        _column = _line - (8 - l - 4);
      }
      if (c < 4 || _column < -1) {
        _line = 0;
        _column = 0;
      }
      const value = Number.parseFloat(((_line + _column) / 2).toFixed(1));
      return value < 0 ? 0 : value;
    })(line, column),
    excitacao: ((l: number, c: number) => {
      let _line = l > 4 ? 0 : answer.max - l;
      let _column = c < 4 ? 0 : c - answer.max;
      if (l > 4 || c < 4) {
        _line = 0;
        _column = 0;
      }
      return Number.parseFloat(((_line + _column) / 2).toFixed(1));
    })(line, column),
    alta_excitacao: ((l: number, c: number) => {
      let _line = l > 4 ? 0 : answer.max - l;
      let _column: number;
      if (c === 4) {
        _column = _line;
      } else if (c > 4) {
        _column = _line - (c - 4);
      } else {
        _column = _line - (8 - c - 4);
      }
      if (l > 4 || _column < -1) {
        _line = 0;
        _column = 0;
      }
      const value = Number.parseFloat(((_line + _column) / 2).toFixed(1));
      return value < 0 ? 0 : value;
    })(line, column),
    estresse: ((l: number, c: number) => {
      let _line = l > 4 ? 0 : answer.max - l;
      let _column = c > 4 ? 0 : answer.max - c;
      if (l > 4 || c > 4) {
        _line = 0;
        _column = 0;
      }
      return Number.parseFloat(((_line + _column) / 2).toFixed(1));
    })(line, column),
    desagradavel: ((l: number, c: number) => {
      let _line = c > 4 ? 0 : answer.max - c;
      let _column: number;
      if (l === 4) {
        _column = _line;
      } else if (l > 4) {
        _column = _line - (l - 4);
      } else {
        _column = _line - (8 - l - 4);
      }
      if (c > 4 || _column < -1) {
        _line = 0;
        _column = 0;
      }
      const value = Number.parseFloat(((_line + _column) / 2).toFixed(1));
      return value < 0 ? 0 : value;
    })(line, column),
    depressao: ((l: number, c: number) => {
      let _line = l < 4 ? 0 : l - answer.max;
      let _column = c > 4 ? 0 : answer.max - c;
      if (l < 4 || c > 4) {
        _line = 0;
        _column = 0;
      }
      return Number.parseFloat(((_line + _column) / 2).toFixed(1));
    })(line, column),
    sonolencia: ((l: number, c: number) => {
      let _line = l < 4 ? 0 : l - answer.max;
      let _column: number;
      if (c === 4) {
        _column = _line;
      } else if (c > 4) {
        _column = _line - (c - 4);
      } else {
        _column = _line - (8 - c - 4);
      }
      if (l < 4 || _column < -1) {
        _line = 0;
        _column = 0;
      }
      const value = Number.parseFloat(((_line + _column) / 2).toFixed(1));
      return value < 0 ? 0 : value;
    })(line, column),
    relaxamento: ((l: number, c: number) => {
      let _line = l < 4 ? 0 : l - answer.max;
      let _column = c < 4 ? 0 : c - answer.max;
      if (l < 4 || c < 4) {
        _line = 0;
        _column = 0;
      }
      return Number.parseFloat(((_line + _column) / 2).toFixed(1));
    })(line, column),
  };
}

describe('AffectGridComponent', () => {
  function createComponent() {
    TestBed.configureTestingModule({ imports: [AffectGridComponent] });
    const fixture = TestBed.createComponent(AffectGridComponent);
    const emitted: (string | null)[] = [];
    fixture.componentInstance.answerChange.subscribe((value) => emitted.push(value));
    return { component: fixture.componentInstance, emitted };
  }

  it('produz para as 81 células os mesmos valores do app AngularJS', () => {
    const { component, emitted } = createComponent();

    for (let cell = 1; cell <= 81; cell++) {
      emitted.length = 0;
      component.select(cell);
      const payload = emitted.at(-1);
      expect(payload, `célula ${cell}`).toBeTypeOf('string');

      const answer = JSON.parse(payload as string);
      expect(answer.max).toBe(4);
      expect(answer.min).toBe(0);
      expect(answer.type).toBe('number');
      expect(answer.data, `célula ${cell}`).toEqual(legacyAnswer(cell));

      // Desmarca para a próxima célula começar do zero.
      component.select(cell);
    }
  });

  it('destaca a célula escolhida e limpa ao tocar de novo', () => {
    const { component, emitted } = createComponent();

    component.select(10);
    expect(component.opacity(10)).toBe(0.5);
    expect(component.opacity(11)).toBe(0);

    component.select(10);
    expect(component.opacity(10)).toBe(0);
    expect(emitted.at(-1)).toBeNull();
  });
});
