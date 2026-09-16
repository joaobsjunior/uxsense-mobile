import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiService } from './api.service';
import { DeviceService } from './device.service';
import { DialogService } from './dialog.service';
import { TranslateService } from './i18n/translate.service';
import { SessionService } from './session.service';

/** Login, logout e registro do token de push. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly device = inject(DeviceService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  /**
   * Autentica o aluno enviando, junto das credenciais, os dados do aparelho e
   * o token de push — exatamente como o LoginController do app AngularJS.
   */
  async login(credentials: { register: string; password: string }): Promise<void> {
    const token = await this.device.getPushToken();
    const params: Record<string, string | number | boolean> = {
      ...credentials,
      ...this.device.deviceInfo(),
    };
    if (token) {
      params['registrator_id'] = token;
    }

    this.session.isSended = false;
    const data = await firstValueFrom(this.api.login(params));
    this.session.setAuthenticated(data);
    this.session.tokenFCM = token;
    await this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }

  /** Logout pedido pelo usuário; em caso de falha oferece tentar de novo. */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.api.logout());
      await this.finishLogout();
    } catch {
      const retry = await this.dialog.confirm({
        title: this.translate.instant('popupError'),
        message: this.translate.instant('server-timeout'),
        confirmText: this.translate.instant('labelRetry'),
      });
      if (retry) {
        await this.logout();
      }
    }
  }

  /** Atualiza no servidor o token de push quando ele muda. */
  async syncPushToken(token: string | null): Promise<void> {
    if (!token || token === this.session.tokenFCM || !this.session.isAuthenticated()) {
      this.session.tokenFCM = token;
      return;
    }
    try {
      await firstValueFrom(this.api.updateRegistration({ registration_id: token }));
      this.session.tokenFCM = token;
    } catch (error) {
      console.error('updateRegistration', error);
    }
  }

  private async finishLogout(): Promise<void> {
    this.session.clear();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
