import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EnderecoService } from '../../services/endereco.service';
import { Endereco } from '../../models/endereco.model';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-minha-conta',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './minha-conta.html',
    styleUrl: './minha-conta.css'
})
export class MinhaContaComponent implements OnInit {

    // --- perfil ---
    editandoPerfil = signal(false);
    salvandoPerfil = signal(false);
    erroPerfil = signal<string | null>(null);
    sucessoPerfil = signal<string | null>(null);

    formPerfil = new FormGroup({
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        telefone: new FormControl('', Validators.required),
        data_nascimento: new FormControl(''),
        sexo: new FormControl('')
    });

    // --- endereço (igual antes) ---
    enderecos = signal<Endereco[]>([]);
    editandoEnderecoId = signal<number | null>(null);
    adicionando = signal(false);
    erroEndereco = signal<string | null>(null);
    sucessoEndereco = signal<string | null>(null);
    buscandoCep = signal(false);

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
        public authService: AuthService,
        private enderecoService: EnderecoService
    ) { }

    ngOnInit() {
        this.carregarPerfil();
        this.carregarEnderecos();
    }

    // === PERFIL ===

    carregarPerfil() {
        this.authService.buscarPerfil()
            .pipe(catchError(() => of(null)))
            .subscribe(res => {
                if (res) {
                    this.formPerfil.patchValue(res);
                    this.formPerfil.disable(); // começa desabilitado, só habilita ao clicar  no botão "Editar"
                }
            });
    }

    iniciarEdicaoPerfil() {
        this.formPerfil.enable();
        this.editandoPerfil.set(true);
        this.erroPerfil.set(null);
    }

    cancelarEdicaoPerfil() {
        this.formPerfil.disable();
        this.editandoPerfil.set(false);
        this.erroPerfil.set(null);
        this.carregarPerfil(); // restaura os valores originais
    }

    salvarPerfil() {
        if (this.formPerfil.invalid) {
            this.erroPerfil.set('Preencha todos os campos obrigatórios.');
            return;
        }

        this.salvandoPerfil.set(true);
        this.erroPerfil.set(null);

        this.authService.editarPerfil(this.formPerfil.value).subscribe({
            next: (res) => {
                this.salvandoPerfil.set(false);
                this.editandoPerfil.set(false);
                this.formPerfil.disable();
                this.sucessoPerfil.set('Dados atualizados com sucesso!');
                setTimeout(() => this.sucessoPerfil.set(null), 3000);

                // atualiza o nome/email na navbar se mudou
                if (res.email !== this.authService.usuario()?.email) {
                    const token = this.authService.getToken()!;
                    this.authService.salvarSessao(token, res.first_name, res.email);
                } else if (res.first_name !== this.authService.usuario()?.nome) {
                    const token = this.authService.getToken()!;
                    this.authService.salvarSessao(token, res.first_name, res.email);
                }
            },
            error: (err) => {
                this.salvandoPerfil.set(false);
                this.erroPerfil.set(err.error || 'Não foi possível salvar. Tente novamente.');
            }
        });
    }

    // ENDEREÇO  

    carregarEnderecos() {
        this.enderecoService.listar()
            .pipe(catchError(() => of([])))
            .subscribe(res => this.enderecos.set(res));
    }

    buscarCep() {
        const cep = (this.formEndereco.value.cep || '').replace(/\D/g, '');
        if (cep.length !== 8) return;
        this.buscandoCep.set(true);
        this.enderecoService.buscarCep(cep).subscribe({
            next: (res) => {
                this.buscandoCep.set(false);
                if (res.erro) { this.erroEndereco.set('CEP não encontrado.'); return; }
                this.formEndereco.patchValue({
                    logradouro: res.logradouro || '',
                    tipo_logradouro: res.logradouro_tipo || '',
                    bairro: res.bairro || '',
                    cidade: res.localidade || '',
                    estado: res.uf || ''
                });
            },
            error: () => { this.buscandoCep.set(false); }
        });
    }

    abrirFormNovo() {
        this.formEndereco.reset();
        this.editandoEnderecoId.set(null);
        this.adicionando.set(true);
        this.erroEndereco.set(null);
    }

    editarEndereco(e: Endereco) {
        this.formEndereco.patchValue(e);
        this.editandoEnderecoId.set(e.id);
        this.adicionando.set(true);
        this.erroEndereco.set(null);
    }

    cancelarEndereco() {
        this.adicionando.set(false);
        this.editandoEnderecoId.set(null);
        this.formEndereco.reset();
        this.erroEndereco.set(null);
    }

    salvarEndereco() {
        if (this.formEndereco.invalid) {
            this.erroEndereco.set('Preencha todos os campos obrigatórios.');
            return;
        }
        const dto = this.formEndereco.value as any;
        const id = this.editandoEnderecoId();
        const obs = id
            ? this.enderecoService.atualizar(id, dto)
            : this.enderecoService.criar(dto);

        obs.pipe(catchError(() => {
            this.erroEndereco.set('Não foi possível salvar o endereço.');
            return of(null);
        })).subscribe(res => {
            if (res) {
                this.sucessoEndereco.set(id ? 'Endereço atualizado!' : 'Endereço adicionado!');
                this.cancelarEndereco();
                this.carregarEnderecos();
                setTimeout(() => this.sucessoEndereco.set(null), 3000);
            }
        });
    }
}