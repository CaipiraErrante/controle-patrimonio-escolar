import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    document = TestBed.inject(DOCUMENT);
    document.cookie = 'csrftoken=test-csrf-token';
  });

  afterEach(() => {
    http.verify();
    document.cookie =
      'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('requests a CSRF token then authenticates with Allauth', async () => {
    const loginPromise = service.login('usuario', 'senha-segura');

    const configRequest = http.expectOne('/_allauth/browser/v1/config');
    expect(configRequest.request.method).toBe('GET');
    configRequest.flush({});

    await Promise.resolve();

    const loginRequest = http.expectOne('/_allauth/browser/v1/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual({
      username: 'usuario',
      password: 'senha-segura',
    });
    expect(loginRequest.request.headers.get('X-CSRFToken')).toBe(
      'test-csrf-token',
    );
    expect(loginRequest.request.withCredentials).toBe(true);
    loginRequest.flush({ meta: { is_authenticated: true } });

    await expect(loginPromise).resolves.toBeUndefined();
  });

  it('stops before login when the CSRF cookie is unavailable', async () => {
    document.cookie =
      'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    const loginPromise = service.login('usuario', 'senha-segura');
    http.expectOne('/_allauth/browser/v1/config').flush({});

    await expect(loginPromise).rejects.toThrow(
      'O servidor não forneceu o token de segurança do login.',
    );
    http.expectNone('/_allauth/browser/v1/auth/login');
  });
});
