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

    enderecos = signal<Endereco[]>([]);
    editandoId = signal<number | null>(null);
    adicionando = signal(false);
    erro = signal<string | null>(null);
    sucesso = signal<string | null>(null);
    buscandoCep = signal(false);

    form = new FormGroup({
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
        this.carregarEnderecos();
    }

    carregarEnderecos() {
        this.enderecoService.listar()
            .pipe(catchError(() => of([])))
            .subscribe(res => this.enderecos.set(res));
    }

    buscarCep() {
        const cep = this.form.value.cep || '';
        if (cep.replace(/\D/g, '').length !== 8) return;

        this.buscandoCep.set(true);
        this.enderecoService.buscarCep(cep).subscribe({
            next: (res) => {
                this.buscandoCep.set(false);
                if (res.erro) {
                    this.erro.set('CEP não encontrado.');
                    return;
                }
                this.form.patchValue({
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

    abrirFormNovo() {
        this.form.reset();
        this.editandoId.set(null);
        this.adicionando.set(true);
        this.erro.set(null);
    }

    editarEndereco(e: Endereco) {
        this.form.patchValue(e);
        this.editandoId.set(e.id);
        this.adicionando.set(true);
        this.erro.set(null);
    }

    cancelar() {
        this.adicionando.set(false);
        this.editandoId.set(null);
        this.form.reset();
        this.erro.set(null);
    }

    salvar() {
        if (this.form.invalid) {
            this.erro.set('Preencha todos os campos obrigatórios.');
            return;
        }

        const dto = this.form.value as any;
        const id = this.editandoId();

        const obs = id
            ? this.enderecoService.atualizar(id, dto)
            : this.enderecoService.criar(dto);

        obs.pipe(catchError(() => {
            this.erro.set('Não foi possível salvar o endereço.');
            return of(null);
        })).subscribe(res => {
            if (res) {
                this.sucesso.set(id ? 'Endereço atualizado!' : 'Endereço adicionado!');
                this.cancelar();
                this.carregarEnderecos();
                setTimeout(() => this.sucesso.set(null), 3000);
            }
        });
    }


}