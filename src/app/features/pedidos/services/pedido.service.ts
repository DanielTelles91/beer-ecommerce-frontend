import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Pedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {

    private apiUrl = `${environment.apiUrl}/api/pedidos`;

    constructor(private http: HttpClient) { }

    finalizar() {
        return this.http.post<Pedido>(this.apiUrl, {});
    }

    meusPedidos() {
        return this.http.get<Pedido[]>(`${this.apiUrl}/meus-pedidos`);
    }
}