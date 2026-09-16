/** Regras de validação herdadas do app AngularJS. */

/** A senha precisa ter ao menos 6 caracteres (o campo limita em 16). */
export function isValidPassword(value: string | null | undefined): boolean {
  return !!value && value.length >= 6;
}

/** O login aceita apenas letras, números, ponto e underscore. */
export function sanitizeRegister(value: string | number | null | undefined): string {
  return String(value ?? '').replace(/[^0-9a-z._]/gi, '');
}

/** Converte a data do formulário (ISO ou Date) para o formato yyyy-MM-dd da API. */
export function toApiDate(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value.substring(0, 10) : null;
  }
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Data máxima aceita para nascimento: ontem, como no app original. */
export function yesterdayIso(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().substring(0, 10);
}
