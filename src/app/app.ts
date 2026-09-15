import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { DeviceService } from './core/device.service';
import { QuestionService } from './core/question.service';
import { SessionService } from './core/session.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class App implements OnInit {
  private readonly device = inject(DeviceService);
  private readonly session = inject(SessionService);
  private readonly questions = inject(QuestionService);

  ngOnInit(): void {
    this.device.hideSplashScreen();
    // Quem já aceitou os termos volta a receber notificações assim que o app
    // abre (antes isso só era registrado na tela de termos).
    if (this.session.hasAcceptedTerms()) {
      this.questions.configureNotifications();
    }
  }
}
