import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-lost-password',
  imports: [
    ReactiveFormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar,
    TranslatePipe,
  ],
  templateUrl: './lost-password.page.html',
})
export class LostPasswordPage {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      await this.dialog.warning(this.translate.instant('msgRequiredFields'));
      return;
    }

    try {
      const response = await firstValueFrom(this.api.lostPassword(this.form.getRawValue()));
      const message =
        response?.sent === true
          ? this.translate.instant('msgLostPasswordSuccess')
          : this.translate.instant('msgLostPasswordError');
      await this.dialog.success(message);
      this.session.clear();
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }
}
