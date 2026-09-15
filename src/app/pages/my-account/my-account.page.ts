import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  IonButton,
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
import { AuthService } from '../../core/auth.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { SessionService } from '../../core/session.service';
import { toApiDate, yesterdayIso } from '../../shared/validation';

@Component({
  selector: 'app-my-account',
  imports: [
    ReactiveFormsModule,
    IonButton,
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
  templateUrl: './my-account.page.html',
})
export class MyAccountPage {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);

  readonly maxBirthDate = yesterdayIso();

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    sex: ['NIL'],
    register: [{ value: '', disabled: true }],
    datebirth: [''],
    password: [''],
    newpassword: [''],
    newpassword_: [''],
  });

  ionViewWillEnter(): void {
    this.fillFromSession();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      await this.dialog.warning(this.translate.instant('msgRequiredFields'));
      return;
    }

    const value = this.form.getRawValue();

    if (!value.password) {
      if (value.newpassword || value.newpassword_) {
        await this.dialog.warning(this.translate.instant('msgCurrentPasswordRequired'));
        this.form.patchValue({ newpassword: '', newpassword_: '' });
        return;
      }
    } else if (value.newpassword !== value.newpassword_) {
      await this.dialog.warning(this.translate.instant('msgPasswordNotEquals'));
      return;
    }

    const params: Record<string, string> = {
      name: value.name,
      email: value.email,
      sex: value.sex,
      register: value.register,
    };
    const datebirth = toApiDate(value.datebirth);
    if (datebirth) {
      params['datebirth'] = datebirth;
    }
    if (value.password) {
      params['password'] = value.password;
      params['newpassword'] = value.newpassword;
      params['newpassword_'] = value.newpassword_;
    }

    try {
      const client = await firstValueFrom(this.api.changeClient(params));
      this.session.updateClient(client);
      await this.dialog.success(this.translate.instant('msgChangeSuccess'));
      this.fillFromSession();
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }

  logout(): void {
    void this.auth.logout();
  }

  private fillFromSession(): void {
    const client = this.session.client();
    this.form.reset({
      name: client?.name ?? '',
      email: client?.email ?? '',
      sex: client?.sex ?? 'NIL',
      register: client?.register ?? '',
      datebirth: client?.datebirth ? client.datebirth.substring(0, 10) : '',
      password: '',
      newpassword: '',
      newpassword_: '',
    });
  }
}
