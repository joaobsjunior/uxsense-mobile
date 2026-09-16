import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonInput, IonItem, IonList } from '@ionic/angular';

import { AuthService } from '../../core/auth.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { isValidPassword, sanitizeRegister } from '../../shared/validation';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonList,
    TranslatePipe,
  ],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    register: ['', Validators.required],
    password: ['', Validators.required],
  });

  /** Mantém no campo de login apenas os caracteres aceitos pela API. */
  onRegisterInput(): void {
    const control = this.form.controls.register;
    const sanitized = sanitizeRegister(control.value);
    if (sanitized !== control.value) {
      control.setValue(sanitized);
    }
  }

  get passwordTooShort(): boolean {
    const value = this.form.controls.password.value;
    return !!value && !isValidPassword(value);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      await this.dialog.warning(this.translate.instant('msgRequiredFields'));
      return;
    }
    const { register, password } = this.form.getRawValue();
    if (!isValidPassword(password)) {
      await this.dialog.warning(this.translate.instant('msgPasswordNotValidation'));
      return;
    }

    try {
      await this.auth.login({ register, password });
      this.form.reset();
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }

  goToSignUp(): void {
    void this.router.navigateByUrl('/signup');
  }

  goToLostPassword(): void {
    void this.router.navigateByUrl('/lost-password');
  }
}
