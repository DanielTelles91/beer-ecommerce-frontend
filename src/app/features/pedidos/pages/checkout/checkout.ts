import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { EnderecoService } from '../../../auth/services/endereco.service';
import { PedidoService } from '../../services/pedido.service';
import { Endereco } from '../../../auth/models/endereco.model';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {

    endereco = signal<Endereco | null>(null);
    erro = signal<string | null>(null);
    carregando = signal(false);
    pedidoConfirmado = signal(false);
    pedidoId = signal<number | null>(null);

    constructor(
        public carrinhoService: CarrinhoService,
        private enderecoService: EnderecoService,
        private pedidoService: PedidoService,
        private router: Router
    ) { }

    ngOnInit() {
        this.enderecoService.listar().subscribe(enderecos => {
            if (enderecos.length > 0) this.endereco.set(enderecos[0]);
        });
    }

    confirmar() {
        this.carregando.set(true);
        this.erro.set(null);

        this.pedidoService.finalizar()
            .pipe(catchError(err => {
                this.erro.set(err.error || 'Não foi possível finalizar o pedido. Tente novamente.');
                this.carregando.set(false);
                return of(null);
            }))
            .subscribe(res => {
                if (res) {
                    this.carregando.set(false);
                    this.pedidoId.set(res.id);
                    this.pedidoConfirmado.set(true);
                    this.carrinhoService.carregar();  // atualiza mini-carrinho na navbar
                }
            });
    }
}