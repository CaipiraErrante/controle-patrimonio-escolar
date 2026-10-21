import { provideHttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let http: HttpTestingController;
  let document: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .compileComponents();
    http = TestBed.inject(HttpTestingController);
    document = TestBed.inject(DOCUMENT);
    document.cookie = 'csrftoken=test-csrf-token';
  });

  afterEach(() => {
    http.verify();
    document.cookie =
      'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the login screen', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Acesse sua conta');
    expect(compiled.querySelector('input[name="usuario"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="senha"]')).toBeTruthy();
  });

  it('shows a clear message when Allauth rejects the credentials', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.usuario = 'usuario';
    app.senha = 'senha-incorreta';

    const loginAttempt = app.entrar();
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

    expect(app.mensagem).toBe('Usuário ou senha incorretos.');
    expect(app.isSubmitting).toBe(false);
  });
});
