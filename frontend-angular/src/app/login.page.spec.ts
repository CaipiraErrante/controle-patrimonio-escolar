import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginPage } from './login.page';
import { routes } from './app.routes';

describe('LoginPage', () => {
  let http: HttpTestingController;
  let document: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    document = TestBed.inject(DOCUMENT);
    document.cookie = 'csrftoken=test-csrf-token';
  });

  afterEach(() => {
    http.verify();
    document.cookie =
      'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('renders the login screen', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Acesse sua conta');
    expect(compiled.querySelector('input[name="usuario"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="senha"]')).toBeTruthy();
  });

  it('shows a clear message when Allauth rejects the credentials', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const page = fixture.componentInstance;
    page.usuario = 'usuario';
    page.senha = 'senha-incorreta';

    const loginAttempt = page.entrar();
    http.expectOne('/_allauth/browser/v1/config').flush({});
    await Promise.resolve();
    http.expectOne('/_allauth/browser/v1/auth/login').flush(
      {
        status: 400,
        errors: [
          {
            message: 'Credenciais inválidas.',
            code: 'username_password_mismatch',
            param: 'password',
          },
        ],
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await loginAttempt;

    expect(page.mensagem).toBe('Usuário ou senha incorretos.');
    expect(page.isSubmitting).toBe(false);
  });
});