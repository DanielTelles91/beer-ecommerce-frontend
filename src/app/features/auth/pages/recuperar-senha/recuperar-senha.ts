import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-recuperar-senha',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './recuperar-senha.html'
})
export class RecuperarSenhaComponent {

    emailControl = new FormControl('', [Validators.required, Validators.email]);
    enviado = signal(false);
    carregando = signal(false);
    erro = signal<string | null>(null);

    constructor(private authService: AuthService) { }

    enviar() {
        if (this.emailControl.invalid) {
            this.erro.set('Informe um e-mail válido.');
            return;
        }
        this.carregando.set(true);
        this.erro.set(null);

        this.authService.recuperarSenha(this.emailControl.value!)
            .pipe(catchError(() => {
                this.carregando.set(false);
                this.erro.set('Não foi possível processar. Tente novamente.');
                return of(null);
            }))
            .subscribe(res => {
                if (res !== null) {
                    this.carregando.set(false);
                    this.enviado.set(true);
                }
            });
    }
}