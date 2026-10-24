import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

export const csrfInterceptor: HttpInterceptorFn = (request, next) => {
  if (SAFE_METHODS.has(request.method.toUpperCase()) || request.headers.has('X-CSRFToken')) {
    return next(request);
  }

  const document = inject(DOCUMENT);
  const csrfCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('csrftoken='));

  if (!csrfCookie) {
    return next(request);
  }

  const token = decodeURIComponent(csrfCookie.slice('csrftoken='.length));
  return next(request.clone({ setHeaders: { 'X-CSRFToken': token } }));
};