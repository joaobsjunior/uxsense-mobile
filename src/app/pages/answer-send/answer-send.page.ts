import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { DeviceService } from '../../core/device.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { QuestionService } from '../../core/question.service';
import { SessionService } from '../../core/session.service';
import { AffectGridComponent } from '../../techniques/affect-grid/affect-grid.component';
import { AttrakdiffComponent } from '../../techniques/attrakdiff/attrakdiff.component';
import { EmocardsComponent } from '../../techniques/emocards/emocards.component';
import { EsmComponent } from '../../techniques/esm/esm.component';
import { PanasComponent } from '../../techniques/panas/panas.component';
import { PremoComponent } from '../../techniques/premo/premo.component';
import { SamComponent } from '../../techniques/sam/sam.component';
import {
  SerializedAnswer,
  TECHNIQUE_AFFECT_GRID,
  TECHNIQUE_ATTRAKDIFF,
  TECHNIQUE_EMOCARDS,
  TECHNIQUE_ESM,
  TECHNIQUE_PANAS,
  TECHNIQUE_PREMO,
  TECHNIQUE_SAM,
} from '../../techniques/technique.types';
import { toApiDate } from '../../shared/validation';

@Component({
  selector: 'app-answer-send',
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    TranslatePipe,
    AffectGridComponent,
    AttrakdiffComponent,
    EmocardsComponent,
    EsmComponent,
    PanasComponent,
    PremoComponent,
    SamComponent,
  ],
  templateUrl: './answer-send.page.html',
})
export class AnswerSendPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly questions = inject(QuestionService);
  private readonly device = inject(DeviceService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly notification = this.session.notification;
  readonly submitted = signal(false);

  readonly answer = signal<SerializedAnswer>(null);

  protected readonly techniques = {
    emocards: TECHNIQUE_EMOCARDS,
    affectGrid: TECHNIQUE_AFFECT_GRID,
    panas: TECHNIQUE_PANAS,
    attrakdiff: TECHNIQUE_ATTRAKDIFF,
    premo: TECHNIQUE_PREMO,
    esm: TECHNIQUE_ESM,
    sam: TECHNIQUE_SAM,
  };

  ionViewWillEnter(): void {
    this.submitted.set(false);
    this.answer.set(null);
    if (!this.session.notification()) {
      void this.router.navigateByUrl('/tabs/answer', { replaceUrl: true });
      return;
    }
    // A localização é anexada à resposta, como no app original.
    void this.device.getPosition().then((position) => (this.session.location = position));
  }

  onAnswerChange(value: SerializedAnswer): void {
    this.answer.set(value);
  }

  async submit(): Promise<void> {
    this.submitted.set(true);

    const scheduler = this.session.notification();
    const answer = this.answer();
    if (!scheduler || !answer) {
      await this.dialog.warning(this.translate.instant('msgRequiredOption'));
      return;
    }

    const clientId = this.session.client()?.id;
    if (!clientId) {
      return;
    }

    const now = new Date();
    const params: Record<string, string | number> = {
      date: toApiDate(now) ?? '',
      time: now.toTimeString().substring(0, 5),
      answer,
      client_id: clientId,
      scheduler_id: scheduler.id,
      technique_id: scheduler.technique.id,
    };
    const { latitude, longitude } = this.session.location;
    if (latitude !== undefined && longitude !== undefined) {
      params['latitude'] = latitude;
      params['longitude'] = longitude;
    }

    try {
      await firstValueFrom(this.api.sendAnswer(params));
      await this.dialog.success(this.translate.instant('msgAnswerSuccess'));
      this.session.notification.set(null);
      this.session.isSended = false;
      await this.router.navigateByUrl('/tabs/answer', { replaceUrl: true });
      await this.questions.checkNewQuestion();
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }
}
