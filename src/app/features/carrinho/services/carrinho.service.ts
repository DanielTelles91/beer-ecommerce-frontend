import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Carrinho } from '../models/carrinho.model';
import { environment } from '../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {


    private apiUrl = `${environment.apiUrl}/api/carrinho`;
    private sessionId: string;

    carrinho = signal<Carrinho>({ itens: [], total: 0, totalItens: 0 });

    constructor(private http: HttpClient) {

        if (typeof window !== 'undefined') {
            this.sessionId = this.obterOuCriarSessionId();
            this.carregar();
        } else {
            this.sessionId = '';
        }

    }

    private obterOuCriarSessionId(): string { // mod p/ funcionar em outros pc da rede, HTTPS 
        let id = localStorage.getItem('cart_session_id');

        if (!id) {
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                id = window.crypto.randomUUID();
            } else {
                id = Date.now().toString(36) + Math.random().toString(36).substring(2);
            }

            localStorage.setItem('cart_session_id', id);
        }

        return id;
    }

    carregar() {
        if (!this.sessionId) return;
        this.http.get<Carrinho>(`${this.apiUrl}?sessionId=${this.sessionId}`)
            .subscribe(res => this.carrinho.set(res));
    }

    adicionarItem(cervejaId: number, quantidade: number = 1) {
        this.http.post<Carrinho>(
            `${this.apiUrl}/itens?sessionId=${this.sessionId}&cervejaId=${cervejaId}&quantidade=${quantidade}`,
            {}
        ).subscribe(res => this.carrinho.set(res));
    }

    atualizarQuantidade(itemId: number, quantidade: number) {
        this.http.put<Carrinho>(
            `${this.apiUrl}/itens/${itemId}?sessionId=${this.sessionId}&quantidade=${quantidade}`,
            {}
        ).subscribe(res => this.carrinho.set(res));
    }

    removerItem(itemId: number) {
        this.http.delete<Carrinho>(
            `${this.apiUrl}/itens/${itemId}?sessionId=${this.sessionId}`
        ).subscribe(res => this.carrinho.set(res));
    }

    mergeCarrinho() {
        if (!this.sessionId) return;
        this.http.post<Carrinho>(`${this.apiUrl}/merge?sessionId=${this.sessionId}`, {})
            .pipe(catchError(() => of(this.carrinho())))
            .subscribe(res => this.carrinho.set(res));
    }


}