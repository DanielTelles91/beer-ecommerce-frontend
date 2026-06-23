import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
    selector: 'app-carrinho-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './carrinho-page.html',
    styleUrl: './carrinho-page.css'
})
export class CarrinhoPageComponent {

    constructor(public carrinhoService: CarrinhoService) { }

    aumentar(itemId: number, quantidadeAtual: number) {
        this.carrinhoService.atualizarQuantidade(itemId, quantidadeAtual + 1);
    }

    diminuir(itemId: number, quantidadeAtual: number) {
        // se chegar a 0, o backend já remove o item (lembra da regra no CarrinhoService)
        this.carrinhoService.atualizarQuantidade(itemId, quantidadeAtual - 1);
    }

    remover(itemId: number) {
        this.carrinhoService.removerItem(itemId);
    }

    finalizarCompra() {
        alert('Checkout ainda não implementado — em breve!');
        // futuramente: this.router.navigate(['/checkout']);
    }
}