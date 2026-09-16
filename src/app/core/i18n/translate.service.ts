import { Injectable } from '@angular/core';

import { PT } from './pt';

const DICTIONARIES: Record<string, Record<string, string>> = { pt: PT };

/**
 * Substituto enxuto do angular-translate usado pelo app AngularJS.
 * Mantém a mesma API de consulta por chave e o mesmo dicionário.
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private language = 'pt';

  use(language: string): void {
    if (DICTIONARIES[language]) {
      this.language = language;
    }
  }

  current(): string {
    return this.language;
  }

  /** Devolve o texto da chave; se não existir, devolve a própria chave. */
  instant(key: string): string {
    if (!key) {
      return '';
    }
    return DICTIONARIES[this.language]?.[key] ?? key;
  }
}
