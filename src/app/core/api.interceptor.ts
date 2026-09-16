import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TimeoutError, catchError, finalize, throwError, timeout } from 'rxjs';

import { ApiError, REQUEST_OPTIONS } from './api.types';
import { DialogService } from './dialog.service';
import { TranslateService } from './i18n/translate.service';
import { LoadingService } from './loading.service';
import { SessionService } from './session.service';

/** Mesmo limite de 30s usado na configuração do $http original. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Trata de forma central o que o `requestService` do AngularJS fazia em cada
 * chamada: envia os cabeçalhos de autenticação, controla o indicador de
 * carregamento, traduz o erro para a mensagem exibida e desloga no 401.
 */
export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(SessionService);
  const loading = inject(LoadingService);
  const translate = inject(TranslateService);
  const dialog = inject(DialogService);
  const router = inject(Router);

  const options = request.context.get(REQUEST_OPTIONS);
  const authorized = request.clone({
    setHeaders: { 'Content-Type': 'application/json', ...session.authHeader },
  });

  if (options.loading) {
    loading.show();
  }

  return next(authorized).pipe(
    timeout(REQUEST_TIMEOUT_MS),
    catchError((cause: unknown) => {
      const status = toStatus(cause);
      const message =
        status <= 0
          ? translate.instant('server-timeout')
          : translate.instant(`server-error${status}`);
      const error: ApiError = { status, message };

      if (status === 401) {
        // Sessão expirada: avisa, limpa os dados e volta para o login.
        session.clear();
        void dialog.error(message).then(() => router.navigateByUrl('/login'));
      } else if (options.loading && !options.silent) {
        void dialog.error(message);
      }

      return throwError(() => error);
    }),
    finalize(() => {
      if (options.loading) {
        loading.hide();
      }
    }),
  );
};

/** Sem resposta do servidor vira -1, como no $http do AngularJS. */
function toStatus(cause: unknown): number {
  if (cause instanceof TimeoutError) {
    return -1;
  }
  if (cause instanceof HttpErrorResponse) {
    return cause.status > 0 ? cause.status : -1;
  }
  return -1;
}
