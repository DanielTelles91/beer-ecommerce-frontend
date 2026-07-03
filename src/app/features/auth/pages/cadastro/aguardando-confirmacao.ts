import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-aguardando-confirmacao',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="container text-center" style="margin-top: 120px;">
      <div class="card p-5 mx-auto" style="max-width: 480px;">
        <h3 class="mb-3"> Verifique seu e-mail</h3>
        <p class="text-muted">
          Enviamos um link de confirmação para o seu e-mail.
          Clique nele para ativar sua conta e fazer login.
        </p>
        <a routerLink="/login" class="btn btn-outline-success mt-2">Ir para o login</a>
      </div>
    </div>
  `
})
export class AguardandoConfirmacaoComponent { }