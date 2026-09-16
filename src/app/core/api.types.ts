import { HttpContext, HttpContextToken } from '@angular/common/http';

/** Opções por requisição, lidas pelo interceptor. */
export interface RequestOptions {
  /** Exibe o indicador de carregamento enquanto a requisição roda. */
  loading: boolean;
  /** Não exibe popup de erro: quem chamou trata a falha. */
  silent: boolean;
}

export const REQUEST_OPTIONS = new HttpContextToken<RequestOptions>(() => ({
  loading: false,
  silent: false,
}));

export function requestContext(options: Partial<RequestOptions>): HttpContext {
  return new HttpContext().set(REQUEST_OPTIONS, {
    loading: false,
    silent: false,
    ...options,
  });
}

/** Erro já traduzido para a mensagem exibida ao usuário. */
export interface ApiError {
  status: number;
  message: string;
}
