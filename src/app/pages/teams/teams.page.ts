import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, removeCircleOutline } from 'ionicons/icons';

import { ApiService } from '../../core/api.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { Team } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-teams',
  imports: [
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    TranslatePipe,
  ],
  templateUrl: './teams.page.html',
})
export class TeamsPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly teams = signal<Team[]>([]);

  constructor() {
    addIcons({ add, removeCircleOutline });
  }

  ionViewWillEnter(): void {
    void this.load(true);
  }

  async refresh(event: RefresherCustomEvent): Promise<void> {
    await this.load(false);
    await event.target.complete();
  }

  newTeam(): void {
    void this.router.navigateByUrl('/tabs/teams/new');
  }

  async remove(team: Team): Promise<void> {
    const confirmed = await this.dialog.confirm({
      title: this.translate.instant('popupWarning'),
      message: this.translate.instant('msgTeamDeleteConfirm'),
      confirmText: this.translate.instant('labelDelete'),
      destructive: true,
    });
    if (!confirmed) {
      return;
    }

    const clientId = this.session.client()?.id;
    if (!clientId) {
      return;
    }

    try {
      await firstValueFrom(this.api.removeTeamFromClient({ client: clientId, team: team.id }));
      await this.load(true);
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }

  private async load(loading: boolean): Promise<void> {
    const clientId = this.session.client()?.id;
    if (!clientId) {
      this.teams.set([]);
      return;
    }
    try {
      const response = await firstValueFrom(this.api.getTeamsByClient(clientId, loading));
      this.teams.set(response.teams ?? []);
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }
}
