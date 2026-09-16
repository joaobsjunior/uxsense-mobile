import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiService } from './api.service';
import { DeviceService } from './device.service';
import { DialogService } from './dialog.service';
import { TranslateService } from './i18n/translate.service';
import { SessionService } from './session.service';

/** Espera antes de tentar de novo quando o servidor não responde. */
const RETRY_DELAY_MS = 30_000;
const MAX_RETRIES = 3;

/**
 * Descobre se o aluno tem pergunta pendente e o leva para respondê-la.
 * Porta o `checkNewQuestion` do MainController.
 */
@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly device = inject(DeviceService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  private retries = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  /** Registra o tratamento de push; chamado ao aceitar os termos e ao abrir o app. */
  configureNotifications(): void {
    if (!this.device.hasPushSupport()) {
      return;
    }
    this.device.grantPushPermission();
    this.device.onNotificationOpen(() => {
      this.session.isSended = false;
      void this.checkNewQuestion();
    });
  }

  async checkNewQuestion(): Promise<void> {
    this.device.clearBadge();

    if (
      !this.session.isAuthenticated() ||
      this.session.isSended ||
      this.session.checkingQuestions
    ) {
      return;
    }

    this.session.checkingQuestions = true;
    try {
      const scheduler = await firstValueFrom(this.api.getQuestion());
      this.session.isSended = true;
      this.retries = 0;
      if (scheduler?.id) {
        this.session.notification.set(scheduler);
        await this.promptPendingQuestion();
      }
    } catch {
      // Sem resposta do servidor: tenta de novo mais tarde, sem repetir em
      // laço fechado como fazia a versão AngularJS.
      this.session.isSended = false;
      this.scheduleRetry();
    } finally {
      this.session.checkingQuestions = false;
    }
  }

  private async promptPendingQuestion(): Promise<void> {
    const answerNow = await this.dialog.confirm({
      title: this.translate.instant('popupWarning'),
      message: this.translate.instant('msgOldPushNotification'),
      cancelText: this.translate.instant('labelThenAnswer'),
      confirmText: this.translate.instant('labelAnswer'),
    });

    if (answerNow) {
      await this.router.navigateByUrl('/tabs/answer/send');
    } else {
      this.session.notification.set(null);
    }
  }

  private scheduleRetry(): void {
    if (this.retryTimer || this.retries >= MAX_RETRIES) {
      return;
    }
    this.retries += 1;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.checkNewQuestion();
    }, RETRY_DELAY_MS);
  }
}
