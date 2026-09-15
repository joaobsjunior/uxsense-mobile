import { Injectable } from '@angular/core';

import { Coordinates } from './models';

interface CordovaDevice {
  uuid?: string;
  platform?: string;
  version?: string;
  model?: string;
  manufacturer?: string;
  serial?: string;
  isVirtual?: boolean;
  cordova?: string;
  available?: boolean;
}

interface FirebasePlugin {
  grantPermission(success?: () => void, error?: (e: unknown) => void): void;
  onTokenRefresh(success: (token: string) => void, error?: (e: unknown) => void): void;
  onNotificationOpen(success: (notification: unknown) => void, error?: (e: unknown) => void): void;
  setBadgeNumber(value: number): void;
}

interface SplashScreen {
  hide(): void;
}

interface CordovaWindow extends Window {
  device?: CordovaDevice;
  FirebasePlugin?: FirebasePlugin;
}

interface CordovaNavigator extends Navigator {
  splashscreen?: SplashScreen;
}

const TOKEN_TIMEOUT_MS = 5_000;
const POSITION_TIMEOUT_MS = 5_000;
const POSITION_MAX_ATTEMPTS = 3;

/**
 * Acesso aos recursos nativos disponíveis via Cordova (device, push do
 * Firebase, geolocalização e splash screen).
 *
 * Todos os acessos são protegidos: no navegador os plugins não existem e o
 * app precisa continuar funcionando, como acontecia no `ionic serve`.
 */
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private get window(): CordovaWindow {
    return window as CordovaWindow;
  }

  /** Dados do aparelho enviados junto do login (antes: ionic.Platform.device()). */
  deviceInfo(): Record<string, string | boolean> {
    const device = this.window.device;
    if (!device) {
      return {};
    }
    const info: Record<string, string | boolean> = {};
    for (const [key, value] of Object.entries(device)) {
      if (typeof value === 'string' || typeof value === 'boolean') {
        info[key] = value;
      }
    }
    return info;
  }

  hideSplashScreen(): void {
    (navigator as CordovaNavigator).splashscreen?.hide();
  }

  hasPushSupport(): boolean {
    return !!this.window.FirebasePlugin;
  }

  grantPushPermission(): void {
    this.window.FirebasePlugin?.grantPermission();
  }

  clearBadge(): void {
    this.window.FirebasePlugin?.setBadgeNumber(0);
  }

  onNotificationOpen(handler: () => void): void {
    this.window.FirebasePlugin?.onNotificationOpen(
      () => {
        this.clearBadge();
        handler();
      },
      (error) => console.error('onNotificationOpen', error),
    );
  }

  /**
   * Token de push do Firebase. Resolve com `null` quando o plugin não existe
   * ou quando o token não chega a tempo, para nunca travar o login.
   */
  getPushToken(): Promise<string | null> {
    const plugin = this.window.FirebasePlugin;
    if (!plugin) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      let settled = false;
      const done = (token: string | null) => {
        if (!settled) {
          settled = true;
          resolve(token);
        }
      };
      const timer = setTimeout(() => done(null), TOKEN_TIMEOUT_MS);
      plugin.onTokenRefresh(
        (token) => {
          clearTimeout(timer);
          done(token ?? null);
        },
        (error) => {
          console.error('onTokenRefresh', error);
          clearTimeout(timer);
          done(null);
        },
      );
    });
  }

  /** Posição atual do aluno, anexada à resposta enviada. */
  getPosition(): Promise<Coordinates> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({});
        return;
      }
      let attempt = 0;
      const request = () => {
        attempt += 1;
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          () => {
            if (attempt < POSITION_MAX_ATTEMPTS) {
              setTimeout(request, POSITION_TIMEOUT_MS);
            } else {
              resolve({});
            }
          },
          { timeout: POSITION_TIMEOUT_MS, enableHighAccuracy: true },
        );
      };
      request();
    });
  }
}
