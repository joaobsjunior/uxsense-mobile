import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, list, person, people } from 'ionicons/icons';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

/** Abas do app: Home, Times, Respostas e Minha Conta. */
@Component({
  selector: 'app-tabs',
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, TranslatePipe],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" color="primary">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon name="home"></ion-icon>
          <ion-label>{{ 'titleHome' | translate }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="teams" href="/tabs/teams">
          <ion-icon name="people"></ion-icon>
          <ion-label>{{ 'titleTeams' | translate }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="answer" href="/tabs/answer">
          <ion-icon name="list"></ion-icon>
          <ion-label>{{ 'titleAnswer' | translate }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="my-account" href="/tabs/my-account">
          <ion-icon name="person"></ion-icon>
          <ion-label>{{ 'titleMyAccount' | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ home, people, list, person });
  }
}
