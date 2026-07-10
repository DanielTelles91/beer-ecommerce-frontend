import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-carrinho-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './carrinho-page.html',
    styleUrl: './carrinho-page.css'
})
export class CarrinhoPageComponent {

    apiUrl = environment.apiUrl;

    constructor(public carrinhoService: CarrinhoService) { }

    aumentar(itemId: number, quantidadeAtual: number) {
        this.carrinhoService.atualizarQuantidade(itemId, quantidadeAtual + 1);
    }

    diminuir(itemId: number, quantidadeAtual: number) {
        // se chegar a 0, o backend já remove o item 
        this.carrinhoService.atualizarQuantidade(itemId, quantidadeAtual - 1);
    }

    remover(itemId: number) {
        this.carrinhoService.removerItem(itemId);
    }

   
    getImagemUrl(cervejariaId: number, imagem: string): string {
        if (!imagem) return '';
        if (imagem.startsWith('http')) return imagem;
        return `${this.apiUrl}/uploads/images/${cervejariaId}/${imagem}`;
    }

}