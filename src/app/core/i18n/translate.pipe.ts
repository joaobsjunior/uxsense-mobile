import { Pipe, PipeTransform, inject } from '@angular/core';

import { TranslateService } from './translate.service';

/** Equivalente ao filtro `translate` usado nos templates do app original. */
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(key: string | null | undefined): string {
    return this.translate.instant(key ?? '');
  }
}
