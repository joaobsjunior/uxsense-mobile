import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { QuestionService } from '../../core/question.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-term',
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, TranslatePipe],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-center">{{ 'titleTerms' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="term">
        <h2>Termos de Uso e Política de Privacidade</h2>
      </div>
      <div class="spacer"></div>
      <ion-button expand="block" (click)="accept()">
        {{ 'msgtermAcceptAfterRead' | translate }}
      </ion-button>
    </ion-content>
  `,
})
export class TermPage {
  private readonly session = inject(SessionService);
  private readonly questions = inject(QuestionService);
  private readonly router = inject(Router);

  async accept(): Promise<void> {
    this.session.acceptTerms();
    this.questions.configureNotifications();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
