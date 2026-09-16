import { Routes } from '@angular/router';

import { authGuard, guestGuard, termsGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'term',
    canActivate: [termsGuard],
    loadComponent: () => import('./pages/term/term.page').then((m) => m.TermPage),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'lost-password',
    loadComponent: () =>
      import('./pages/lost-password/lost-password.page').then((m) => m.LostPasswordPage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams.page').then((m) => m.TeamsPage),
      },
      {
        path: 'teams/new',
        loadComponent: () => import('./pages/new-team/new-team.page').then((m) => m.NewTeamPage),
      },
      {
        path: 'answer',
        loadComponent: () => import('./pages/answers/answers.page').then((m) => m.AnswersPage),
      },
      {
        path: 'answer/send',
        loadComponent: () =>
          import('./pages/answer-send/answer-send.page').then((m) => m.AnswerSendPage),
      },
      {
        path: 'my-account',
        loadComponent: () =>
          import('./pages/my-account/my-account.page').then((m) => m.MyAccountPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/home' },
];
