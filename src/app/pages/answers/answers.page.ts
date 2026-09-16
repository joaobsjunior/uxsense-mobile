import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { AnswerRecord } from '../../core/models';
import { QuestionService } from '../../core/question.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-answers',
  imports: [
    DatePipe,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    TranslatePipe,
  ],
  templateUrl: './answers.page.html',
})
export class AnswersPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly questions = inject(QuestionService);

  readonly answers = signal<AnswerRecord[]>([]);

  ionViewWillEnter(): void {
    void this.load(true);
  }

  async refresh(event: RefresherCustomEvent): Promise<void> {
    await this.load(false);
    await event.target.complete();
  }

  private async load(loading: boolean): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.getAnswers(loading));
      this.answers.set(response.answers ?? []);
      this.session.isSended = false;
      await this.questions.checkNewQuestion();
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }
}
