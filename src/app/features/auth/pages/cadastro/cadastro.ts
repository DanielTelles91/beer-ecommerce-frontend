import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EnderecoService } from '../../services/endereco.service';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-cadastro',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cadastro.html',
    styleUrl: './cadastro.css'
})
export class CadastroComponent {

    passo = signal(1);
    erro = signal<string | null>(null);
    carregando = signal(false);
    buscandoCep = signal(false);

    // Passo 1 — CPF
    formCpf = new FormGroup({
        cpf: new FormControl('', Validators.required)
    });

    // Passo 2 — Dados pessoais
    formDados = new FormGroup({
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        telefone: new FormControl('', Validators.required),
        data_nascimento: new FormControl('', Validators.required),
        sexo: new FormControl(''),
        senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmarSenha: new FormControl('', Validators.required)
    });

    // Passo 3 — Endereço
    formEndereco = new FormGroup({
        cep: new FormControl('', Validators.required),
        tipo_logradouro: new FormControl('', Validators.required),
        logradouro: new FormControl('', Validators.required),
        logradouro_numero: new FormControl('', Validators.required),
        complemento: new FormControl(''),
        bairro: new FormControl('', Validators.required),
        cidade: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required)
    });

    constructor(
        private authService: AuthService,
        private enderecoService: EnderecoService,
        private carrinhoService: CarrinhoService,
        private router: Router
    ) { }

    // Passo 1: valida CPF no backend
    avancarPasso1() {
        const cpf = this.formCpf.value.cpf || '';
        if (!cpf) { this.erro.set('Informe o CPF.'); return; }

        this.carregando.set(true);
        this.erro.set(null);

        this.authService.verificarCpf(cpf).subscribe({
            next: (res) => {
                this.carregando.set(false);
                if (!res.disponivel) {
                    this.erro.set('Este CPF já está cadastrado.');
                } else {
                    this.passo.set(2);
                }
            },
            error: () => {
                this.carregando.set(false);
                this.erro.set('Erro ao verificar CPF. Tente novamente.');
            }
        });
    }

    // Passo 2: valida e-mail no backend
    avancarPasso2() {
        const { senha, confirmarSenha, email } = this.formDados.value;

        if (this.formDados.invalid) {
            this.erro.set('Preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== confirmarSenha) {
            this.erro.set('As senhas não coincidem.');
            return;
        }

        this.carregando.set(true);
        this.erro.set(null);

        this.authService.verificarEmail(email!).subscribe({
            next: (res) => {
                this.carregando.set(false);
                if (!res.disponivel) {
                    this.erro.set('Este e-mail já está cadastrado.');
                } else {
                    this.passo.set(3);
                }
            },
            error: () => {
                this.carregando.set(false);
                this.erro.set('Erro ao verificar e-mail. Tente novamente.');
            }
        });
    }

    // Passo 3: busca CEP via ViaCEP
    buscarCep() {
        const cep = (this.formEndereco.value.cep || '').replace(/\D/g, '');
        if (cep.length !== 8) return;

        this.buscandoCep.set(true);
        this.enderecoService.buscarCep(cep).subscribe({
            next: (res) => {
                this.buscandoCep.set(false);
                if (res.erro) { this.erro.set('CEP não encontrado.'); return; }
                this.formEndereco.patchValue({
                    logradouro: res.logradouro || '',
                    tipo_logradouro: res.logradouro_tipo || '',
                    bairro: res.bairro || '',
                    cidade: res.localidade || '',
                    estado: res.uf || ''
                });
                this.erro.set(null);
            },
            error: () => {
                this.buscandoCep.set(false);
                this.erro.set('Erro ao buscar CEP.');
            }
        });
    }

    avancarPasso3() {
        if (this.formEndereco.invalid) {
            this.erro.set('Preencha todos os campos do endereço.');
            return;
        }
        this.erro.set(null);
        this.passo.set(4);
    }

    // Passo 4: cadastra cliente → loga automaticamente → cadastra endereço
    confirmar() {
        this.carregando.set(true);
        this.erro.set(null);

        const dadosCliente = {
            cpf: this.formCpf.value.cpf,
            ...this.formDados.value
        };

        // 1. Cadastra o cliente
        this.authService.cadastro(dadosCliente).subscribe({
            next: () => {
                // 2. Salva os dados do endereço no localStorage pra usar depois do login
                if (typeof window !== 'undefined') {
                    localStorage.setItem('endereco_pendente', JSON.stringify(this.formEndereco.value));
                }
                this.carregando.set(false);
                this.router.navigate(['/aguardando-confirmacao']);
            },
            error: () => {
                this.carregando.set(false);
                this.erro.set('Não foi possível concluir o cadastro. Tente novamente.');
            }
        });
    }

    voltar() {
        this.erro.set(null);
        this.passo.set(this.passo() - 1);
    }

    formatarCpf(event: Event) {
        const input = event.target as HTMLInputElement;

        let valor = input.value.replace(/\D/g, '');

        valor = valor
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
            .substring(0, 14);

        this.formCpf.get('cpf')?.setValue(valor, { emitEvent: false });
    }
}