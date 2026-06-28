import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-cadastro',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cadastro.html',
    styleUrl: './cadastro.css'
})
export class CadastroComponent {

    sucesso = signal(false);
    erro = signal<string | null>(null);
    carregando = signal(false);

    form = new FormGroup({
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        cpf: new FormControl('', Validators.required),
        telefone: new FormControl('', Validators.required),
        data_nascimento: new FormControl('', Validators.required),
        sexo: new FormControl(''),
        senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmarSenha: new FormControl('', Validators.required)
    });

    constructor(private authService: AuthService) { }

    cadastrar() {
        if (this.form.value.senha !== this.form.value.confirmarSenha) {
            this.erro.set('As senhas não coincidem.');
            return;
        }

        if (this.form.invalid) {
            this.erro.set('Preencha todos os campos obrigatórios.');
            return;
        }

        this.erro.set(null);
        this.carregando.set(true);

        this.authService.cadastro(this.form.value)
            .pipe(
                catchError(() => {
                    this.erro.set('Não foi possível concluir o cadastro. Verifique os dados (e-mail ou CPF podem já estar em uso).');
                    this.carregando.set(false);
                    return of(null);
                })
            )
            .subscribe(res => {
                this.carregando.set(false);
                if (res !== null) this.sucesso.set(true);
            });
    }
}