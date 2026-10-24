import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface AllauthResponse {
  meta: {
    is_authenticated: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly apiBase = '/_allauth/browser/v1';

  async isAuthenticated(): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.get<AllauthResponse>(`${this.apiBase}/auth/session`, {
        withCredentials: true,
      }),
    );
    return response.meta.is_authenticated;
  }

  async login(username: string, password: string): Promise<void> {
    await firstValueFrom(
      this.http.get(`${this.apiBase}/config`, { withCredentials: true }),
    );

    const csrfToken = this.getCsrfToken();
    if (!csrfToken) {
      throw new Error('O servidor não forneceu o token de segurança do login.');
    }

    const response = await firstValueFrom(
      this.http.post<AllauthResponse>(
        `${this.apiBase}/auth/login`,
        { username, password },
        {
          headers: new HttpHeaders({ 'X-CSRFToken': csrfToken }),
          withCredentials: true,
        },
      ),
    );

    if (!response.meta.is_authenticated) {
      throw new Error('O servidor não confirmou a autenticação.');
    }
  }

  async logout(): Promise<void> {
    if (!this.getCsrfToken()) {
      await firstValueFrom(
        this.http.get(`${this.apiBase}/config`, { withCredentials: true }),
      );
    }

    const csrfToken = this.getCsrfToken();
    if (!csrfToken) {
      throw new Error('O servidor não forneceu o token de segurança para sair.');
    }

    try {
      await firstValueFrom(
        this.http.delete(`${this.apiBase}/auth/session`, {
          headers: new HttpHeaders({ 'X-CSRFToken': csrfToken }),
          withCredentials: true,
        }),
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const response = error.error as Partial<AllauthResponse> | null;
        if (response?.meta?.is_authenticated === false) {
          return;
        }
      }
      throw error;
    }
  }

  private getCsrfToken(): string | null {
    const csrfCookie = this.document.cookie
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('csrftoken='));

    return csrfCookie
      ? decodeURIComponent(csrfCookie.slice('csrftoken='.length))
      : null;
  }
}