import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SessionService } from './session.service';

/**
 * Antes de tudo o aluno precisa aceitar os termos de uso; depois disso as
 * telas internas exigem sessão ativa. Mesmas regras do `checkAuth` original.
 */
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.hasAcceptedTerms()) {
    return router.parseUrl('/term');
  }
  return session.isAuthenticated() ? true : router.parseUrl('/login');
};

/** Telas de entrada (login e cadastro): quem já está logado vai para a home. */
export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.hasAcceptedTerms()) {
    return router.parseUrl('/term');
  }
  return session.isAuthenticated() ? router.parseUrl('/tabs/home') : true;
};

/** A tela de termos só aparece enquanto eles não foram aceitos. */
export const termsGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.hasAcceptedTerms() ? router.parseUrl('/login') : true;
};
