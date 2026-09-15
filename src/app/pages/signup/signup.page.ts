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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { SessionService } from '../../core/session.service';
import { isValidPassword, sanitizeRegister, toApiDate, yesterdayIso } from '../../shared/validation';

@Component({
  selector: 'app-signup',
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
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    TranslatePipe,
  ],
  templateUrl: './signup.page.html',
})
export class SignupPage {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly maxBirthDate = yesterdayIso();

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    sex: ['NIL'],
    register: ['', Validators.required],
    datebirth: [''],
    password: ['', Validators.required],
    password_: ['', Validators.required],
  });

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

  get confirmationTooShort(): boolean {
    const value = this.form.controls.password_.value;
    return !!value && !isValidPassword(value);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      await this.dialog.warning(this.translate.instant('msgRequiredFields'));
      return;
    }

    const value = this.form.getRawValue();
    if (!isValidPassword(value.password) || !isValidPassword(value.password_)) {
      await this.dialog.warning(this.translate.instant('msgPasswordNotValidation'));
      return;
    }
    if (value.password !== value.password_) {
      await this.dialog.warning(this.translate.instant('msgPasswordNotEquals'));
      return;
    }

    const params: Record<string, string> = {
      name: value.name,
      email: value.email,
      sex: value.sex,
      register: value.register,
      password: value.password,
      password_: value.password_,
    };
    const datebirth = toApiDate(value.datebirth);
    if (datebirth) {
      params['datebirth'] = datebirth;
    }

    try {
      const client = await firstValueFrom(this.api.signup(params));
      this.session.updateClient(client);
      await this.dialog.success(this.translate.instant('msgSignupSuccess'));
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }
}
