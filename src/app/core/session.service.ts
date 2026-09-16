import { Injectable, computed, signal } from '@angular/core';

import { AuthData, Coordinates, Scheduler } from './models';

const STORAGE_AUTH_DATA = 'authData';
const STORAGE_AUTH_HEADER = 'authHeader';
const STORAGE_TERMS = 'terms';

/**
 * Estado compartilhado do app: sessão, termos aceitos, token de push,
 * geolocalização e a pergunta pendente.
 *
 * Substitui o `$rootScope` do app AngularJS e mantém as mesmas chaves de
 * localStorage, de modo que quem já estava logado continue logado depois da
 * atualização.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  /** Versão dos termos de uso aceita pelo app (era $rootScope.termVersion). */
  readonly termVersion = '1.0';

  readonly authData = signal<AuthData>({});
  readonly notification = signal<Scheduler | null>(null);

  readonly client = computed(() => this.authData().client ?? null);
  readonly isAuthenticated = computed(() => this.authData().authenticated === true);

  authHeader: Record<string, string> = {};
  terms: Record<string, boolean> = {};
  location: Coordinates = {};
  tokenFCM: string | null = null;

  /** Evita perguntar ao servidor por novas questões em paralelo. */
  isSended = false;
  checkingQuestions = false;

  constructor() {
    this.authData.set(this.read<AuthData>(STORAGE_AUTH_DATA));
    this.authHeader = this.read<Record<string, string>>(STORAGE_AUTH_HEADER);
    this.terms = this.read<Record<string, boolean>>(STORAGE_TERMS);
  }

  hasAcceptedTerms(): boolean {
    return this.terms[this.termVersion] === true;
  }

  acceptTerms(): void {
    this.terms = { ...this.terms, [this.termVersion]: true };
    this.persist();
  }

  setAuthenticated(data: AuthData): void {
    this.authData.set({ ...data, authenticated: true });
    if (data.device) {
      this.authHeader = {
        ...this.authHeader,
        'GSX-DEVICE': String(data.device.id),
        'GSX-TOKEN': data.device.token,
      };
    }
    this.persist();
  }

  updateClient(client: AuthData['client']): void {
    this.authData.update((current) => ({ ...current, client }));
    this.persist();
  }

  /** Limpa a sessão mantendo os termos já aceitos (igual ao clearData original). */
  clear(): void {
    this.authData.set({});
    this.authHeader = {};
    this.tokenFCM = '';
    this.notification.set(null);
    this.persist();
  }

  persist(): void {
    this.write(STORAGE_AUTH_DATA, this.authData());
    this.write(STORAGE_TERMS, this.terms);
    this.write(STORAGE_AUTH_HEADER, this.authHeader);
  }

  private read<T extends object>(key: string): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : ({} as T);
    } catch {
      return {} as T;
    }
  }

  private write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Armazenamento indisponível (aba anônima, cota cheia): segue sem persistir.
    }
  }
}
