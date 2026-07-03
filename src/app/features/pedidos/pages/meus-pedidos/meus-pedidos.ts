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
}