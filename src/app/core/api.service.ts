import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { requestContext } from './api.types';
import {
  AnswersResponse,
  AuthData,
  Client,
  GroupsResponse,
  LostPasswordResponse,
  Scheduler,
  SubgroupsResponse,
  TeamsResponse,
} from './models';

/** Endereço da API do UXSense (mesmo do app AngularJS). */
export const API_BASE_URL = 'http://api.uxsense.com.br/api/app/';

type Params = Record<string, string | number | boolean>;

/**
 * Acesso à API do UXSense. Porta o `requestService` do app AngularJS
 * mantendo verbos, caminhos e parâmetros de cada chamada.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  /* ---------------------------- Sessão ---------------------------- */

  login(params: Params): Observable<AuthData> {
    return this.post<AuthData>('login', params);
  }

  signup(params: Params): Observable<Client> {
    return this.post<Client>('signup', params);
  }

  lostPassword(params: Params): Observable<LostPasswordResponse> {
    return this.post<LostPasswordResponse>('lost-password', params);
  }

  changeClient(params: Params): Observable<Client> {
    return this.post<Client>('client', params);
  }

  updateRegistration(params: Params): Observable<unknown> {
    return this.post<unknown>('update-registration', params);
  }

  logout(): Observable<unknown> {
    return this.get<unknown>('logout', {}, { loading: true, silent: true });
  }

  /* ---------------------------- Grupos ---------------------------- */

  getGroups(): Observable<GroupsResponse> {
    return this.get<GroupsResponse>('group', {}, { loading: true });
  }

  getSubgroupsByGroup(groupId: number): Observable<SubgroupsResponse> {
    return this.get<SubgroupsResponse>(`subgroup/${groupId}`, {}, { loading: true });
  }

  /* ----------------------------- Times ---------------------------- */

  getTeamsBySubgroup(subgroupId: number): Observable<TeamsResponse> {
    return this.get<TeamsResponse>(`team/${subgroupId}`, { subgroup: true }, { loading: true });
  }

  getTeamsByClient(clientId: number, loading: boolean): Observable<TeamsResponse> {
    return this.get<TeamsResponse>(`team/${clientId}`, { client: true }, { loading });
  }

  addTeamToClient(params: Params): Observable<unknown> {
    return this.post<unknown>('team-client', params);
  }

  removeTeamFromClient(params: Params): Observable<unknown> {
    return this.http.delete<unknown>(API_BASE_URL + 'team-client', {
      params: this.toHttpParams(params),
      context: requestContext({ loading: true }),
    });
  }

  /* --------------------------- Respostas -------------------------- */

  getAnswers(loading: boolean): Observable<AnswersResponse> {
    return this.get<AnswersResponse>('answer', {}, { loading });
  }

  sendAnswer(params: Params): Observable<unknown> {
    return this.post<unknown>('answer', params);
  }

  /** Pergunta pendente do aluno; roda em segundo plano, sem spinner nem popup. */
  getQuestion(): Observable<Scheduler> {
    return this.get<Scheduler>('scheduler', {}, { loading: false, silent: true });
  }

  /* --------------------------- Infra HTTP -------------------------- */

  private get<T>(
    path: string,
    params: Params,
    options: { loading: boolean; silent?: boolean },
  ): Observable<T> {
    return this.http.get<T>(API_BASE_URL + path, {
      params: this.toHttpParams(params),
      context: requestContext(options),
    });
  }

  private post<T>(path: string, body: Params): Observable<T> {
    return this.http.post<T>(API_BASE_URL + path, body, {
      context: requestContext({ loading: true }),
    });
  }

  private toHttpParams(params: Params): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      httpParams = httpParams.set(key, String(value));
    }
    return httpParams;
  }
}
