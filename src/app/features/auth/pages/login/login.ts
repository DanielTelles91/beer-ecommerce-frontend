import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {

    erro = signal<string | null>(null);
    carregando = signal(false);

    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        senha: new FormControl('', Validators.required)
    });

    constructor(
        private authService: AuthService,
        private carrinhoService: CarrinhoService,
        private router: Router
    ) { }

    entrar() {
        if (this.form.invalid) {
            this.erro.set('Preencha e-mail e senha.');
            return;
        }

        this.erro.set(null);
        this.carregando.set(true);

        const { email, senha } = this.form.value;

        this.authService.login(email!, senha!).subscribe({
            next: (res) => {
                this.authService.salvarSessao(res.token, res.nome, res.email);
                this.carrinhoService.mergeCarrinho(); // <- chama o merge
                this.carregando.set(false);
                this.router.navigate(['/cervejas']);
            },
            error: (err) => {
                this.carregando.set(false);
                if (err.status === 401) {
                    this.erro.set('E-mail ou senha inválidos.');
                } else if (err.status === 403) {
                    this.erro.set('Confirme seu e-mail antes de fazer login.');
                } else {
                    this.erro.set('Não foi possível fazer login. Tente novamente.');
                }
            }
        });
    }
}