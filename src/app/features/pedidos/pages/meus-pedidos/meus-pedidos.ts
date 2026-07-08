import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-meus-pedidos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './meus-pedidos.html',
    styleUrl: './meus-pedidos.css'
})
export class MeusPedidosComponent implements OnInit {

    pedidos = signal<Pedido[]>([]);
    erro = signal<string | null>(null);
    apiUrl = environment.apiUrl;

    constructor(private pedidoService: PedidoService) { }

    ngOnInit() {
        this.pedidoService.meusPedidos()
            .pipe(catchError(() => {
                this.erro.set('Não foi possível carregar seus pedidos.');
                return of([]);
            }))
            .subscribe(res => this.pedidos.set(res));
    }

    getImagemUrl(cervejariaId: number, imagem: string): string {
        return `${this.apiUrl}/uploads/images/${cervejariaId}/${imagem}`;
    }

    pedidoExpandido = signal<number | null>(null);

    togglePedido(id: number) {
        if (this.pedidoExpandido() === id) {
            this.pedidoExpandido.set(null);
        } else {
            this.pedidoExpandido.set(id);
        }
    }


    readonly ETAPAS = [
        { status: 'CONFIRMADO', icone: 'bi-patch-check-fill', label: 'Confirmado' },
        { status: 'SEPARANDO_PRODUTOS', icone: 'bi-box-seam-fill', label: 'Separando' },
        { status: 'ENVIADO', icone: 'bi-truck', label: 'Enviado' },
        { status: 'ENTREGUE', icone: 'bi-house-check-fill', label: 'Entregue' }
    ];

    getEtapas(pedido: Pedido) {
        const indexAtual = this.ETAPAS.findIndex(e => e.status === pedido.status);

        return this.ETAPAS.map((etapa, index) => {
            // busca a data no histórico pra essa etapa
            const entrada = pedido.historico?.find(h => h.status === etapa.status);

            return {
                ...etapa,
                ativo: index <= indexAtual,
                atual: index === indexAtual,
                data: entrada ? entrada.dataMudanca : null
            };
        });
    }

    getDataCancelado(pedido: Pedido): string | null {
        const entrada = pedido.historico?.find(h => h.status === 'CANCELADO');
        return entrada ? entrada.dataMudanca : null;
    }

}