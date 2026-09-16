import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Gesture,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  createGesture,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, list, person, people } from 'ionicons/icons';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

/** Ordem das abas; é a mesma que o deslize percorre. */
const TABS = ['home', 'teams', 'answer', 'my-account'];

/** Distância mínima, em pixels, para o deslize contar como troca de aba. */
const SWIPE_THRESHOLD = 60;

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
export class TabsPage implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  private gesture?: Gesture;

  constructor() {
    addIcons({ home, people, list, person });
  }

  /**
   * Deslizar na horizontal troca de aba, como o on-swipe-left/on-swipe-right
   * do app AngularJS. Fica desligado na tela de resposta, onde o gesto
   * concorreria com as escalas das técnicas.
   */
  ngAfterViewInit(): void {
    this.gesture = createGesture({
      el: this.host.nativeElement,
      gestureName: 'tab-swipe',
      direction: 'x',
      threshold: 15,
      canStart: () => !this.isAnsweringQuestion(),
      onEnd: (detail) => {
        if (Math.abs(detail.deltaX) < SWIPE_THRESHOLD || this.isAnsweringQuestion()) {
          return;
        }
        this.moveTab(detail.deltaX < 0 ? 1 : -1);
      },
    });
    this.gesture.enable(true);
  }

  ngOnDestroy(): void {
    this.gesture?.destroy();
  }

  private isAnsweringQuestion(): boolean {
    return this.router.url.startsWith('/tabs/answer/send');
  }

  private moveTab(step: number): void {
    const current = TABS.findIndex((tab) => this.router.url.startsWith(`/tabs/${tab}`));
    const next = current + step;
    if (current === -1 || next < 0 || next >= TABS.length) {
      return;
    }
    void this.router.navigateByUrl(`/tabs/${TABS[next]}`);
  }
}
