import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { DialogService } from '../../core/dialog.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { TranslateService } from '../../core/i18n/translate.service';
import { Group, Subgroup, Team } from '../../core/models';
import { QuestionService } from '../../core/question.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-new-team',
  imports: [
    ReactiveFormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    TranslatePipe,
  ],
  templateUrl: './new-team.page.html',
})
export class NewTeamPage {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);
  private readonly questions = inject(QuestionService);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly groups = signal<Group[]>([]);
  readonly subgroups = signal<Subgroup[]>([]);
  readonly teams = signal<Team[]>([]);
  readonly selectedTeam = signal<Team | null>(null);

  readonly form = this.fb.nonNullable.group({
    group: [null as Group | null, Validators.required],
    subgroup: [null as Subgroup | null, Validators.required],
    team: [null as Team | null, Validators.required],
  });

  ionViewWillEnter(): void {
    void this.loadGroups();
  }

  /** Trocar de grupo limpa subgrupo e time, como no NewTeamController original. */
  async onGroupChange(): Promise<void> {
    this.form.patchValue({ subgroup: null, team: null });
    this.subgroups.set([]);
    this.teams.set([]);
    this.selectedTeam.set(null);

    const group = this.form.controls.group.value;
    if (!group) {
      return;
    }
    try {
      const response = await firstValueFrom(this.api.getSubgroupsByGroup(group.id));
      this.subgroups.set(response.subgroups ?? []);
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }

  async onSubgroupChange(): Promise<void> {
    this.form.patchValue({ team: null });
    this.teams.set([]);
    this.selectedTeam.set(null);

    const subgroup = this.form.controls.subgroup.value;
    if (!subgroup) {
      return;
    }
    try {
      const response = await firstValueFrom(this.api.getTeamsBySubgroup(subgroup.id));
      this.teams.set(response.teams ?? []);
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }

  onTeamChange(): void {
    this.selectedTeam.set(this.form.controls.team.value);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      await this.dialog.warning(this.translate.instant('msgRequiredFields'));
      return;
    }

    const clientId = this.session.client()?.id;
    const team = this.form.controls.team.value;
    if (!clientId || !team) {
      return;
    }

    try {
      await firstValueFrom(this.api.addTeamToClient({ client: clientId, team: team.id }));
      await this.dialog.success(this.translate.instant('msgTeamRegisterSuccess'));
      await this.router.navigateByUrl('/tabs/teams', { replaceUrl: true });
      this.session.isSended = false;
      await this.questions.checkNewQuestion();
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }

  private async loadGroups(): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.getGroups());
      this.groups.set(response.groups ?? []);
    } catch {
      // O interceptor já exibiu a mensagem de erro ao usuário.
    }
  }
}
