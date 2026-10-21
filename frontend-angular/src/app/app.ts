import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

function getAllauthErrorCode(error: HttpErrorResponse): string | undefined {
  const body: unknown = error.error;
  if (
    typeof body !== 'object' ||
    body === null ||
    !('errors' in body) ||
    !Array.isArray(body.errors)
  ) {
    return undefined;
  }

  const firstError: unknown = body.errors[0];
  if (
    typeof firstError === 'object' &&
    firstError !== null &&
    'code' in firstError &&
    typeof firstError.code === 'string'
  ) {
    return firstError.code;
  }

  return undefined;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);

  usuario = '';
  senha = '';
  mostrarSenha = false;
  tentouEntrar = false;
  mensagem = '';
  isSubmitting = false;
  loginConcluido = false;

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  async entrar(): Promise<void> {
    this.tentouEntrar = true;
    this.mensagem = '';
    this.loginConcluido = false;

    if (!this.usuario.trim() || !this.senha) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.authService.login(this.usuario.trim(), this.senha);
      this.loginConcluido = true;
      this.mensagem =
        'Autenticação realizada. As telas do inventário ainda serão integradas.';
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          this.mensagem = 'Não foi possível conectar ao servidor.';
        } else if (
          error.status === 400 &&
          getAllauthErrorCode(error) === 'username_password_mismatch'
        ) {
          this.mensagem = 'Usuário ou senha incorretos.';
        } else if (error.status === 400) {
          this.mensagem =
            'Os dados enviados foram rejeitados. Confira o usuário e tente novamente.';
        } else if (error.status === 401) {
          this.mensagem =
            'Não foi possível concluir o login. Confira suas credenciais e se a conta exige confirmação.';
        } else if (error.status === 403) {
          this.mensagem =
            'O servidor recusou a solicitação. Verifique a configuração de segurança.';
        } else {
          this.mensagem = `O servidor retornou um erro (${error.status}).`;
        }
      } else if (error instanceof Error) {
        this.mensagem = error.message;
      } else {
        this.mensagem = 'Ocorreu um erro inesperado ao realizar o login.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}