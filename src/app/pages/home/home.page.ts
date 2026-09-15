import { Component, computed, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { QuestionService } from '../../core/question.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-home',
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, TranslatePipe],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ 'titleHome' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding home-content">
      <h1>{{ 'labelHello' | translate }} {{ firstName() }}!</h1>
      <div class="content">
        <p>{{ 'msgHomeIntro' | translate }}</p>
      </div>
    </ion-content>
  `,
})
export class HomePage {
  private readonly session = inject(SessionService);
  private readonly questions = inject(QuestionService);

  readonly firstName = computed(() => this.session.client()?.name?.split(' ')[0] ?? '');

  ionViewWillEnter(): void {
    void this.questions.checkNewQuestion();
  }
}
