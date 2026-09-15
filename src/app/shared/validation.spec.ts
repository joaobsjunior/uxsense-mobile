import { describe, expect, it } from 'vitest';

import { isValidPassword, sanitizeRegister, toApiDate } from './validation';

describe('validation', () => {
  it('aceita apenas senhas com 6 caracteres ou mais', () => {
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword(null)).toBe(false);
  });

  it('remove do login os caracteres não aceitos pela API', () => {
    expect(sanitizeRegister('joao.silva_01')).toBe('joao.silva_01');
    expect(sanitizeRegister('joão silva!')).toBe('joosilva');
    expect(sanitizeRegister(undefined)).toBe('');
  });

  it('converte a data de nascimento para o formato da API', () => {
    expect(toApiDate('1990-05-09')).toBe('1990-05-09');
    expect(toApiDate(new Date(2020, 0, 2))).toBe('2020-01-02');
    expect(toApiDate('')).toBeNull();
    expect(toApiDate(null)).toBeNull();
  });
});
