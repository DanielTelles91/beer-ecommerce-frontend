import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-definir-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './definir-senha.html',
  styleUrl: './definir-senha.css'
})
export class DefinirSenhaComponent {

  token = '';
  sucesso = signal(false);
  erro = signal<string | null>(null);
  carregando = signal(false);

  form = new FormGroup({
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarSenha: new FormControl('', [Validators.required])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.token) {
      this.erro.set('Link inválido. Token não encontrado na URL.');
    }
  }

  confirmar() {
    const senha = this.form.value.senha;
    const confirmarSenha = this.form.value.confirmarSenha;

    if (senha !== confirmarSenha) {
      this.erro.set('As senhas não coincidem.');
      return;
    }

    if (this.form.invalid) {
      this.erro.set('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }

    this.erro.set(null);
    this.carregando.set(true);

    this.authService.definirSenha(this.token, senha!)
      .pipe(
        catchError(() => {
          this.erro.set('Não foi possível definir a senha. O link pode ter expirado ou já foi usado.');
          this.carregando.set(false);
          return of(null);
        })
      )
      .subscribe(res => {
        this.carregando.set(false);
        if (res !== null) {
          this.sucesso.set(true);
          setTimeout(() => this.router.navigate(['/cervejas']), 3000);
        }
      });
  }
}