import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListaDesejosService } from '../../services/lista-desejos.service';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { ListaDesejos } from '../../models/lista-desejos.model';
import { environment } from '../../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-lista-desejos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './lista-desejos.html',
    styleUrl: './lista-desejos.css'
})
export class ListaDesejosComponent implements OnInit {

    itens = signal<ListaDesejos[]>([]);
    erro = signal<string | null>(null);
    apiUrl = environment.apiUrl;

    constructor(
        private listaService: ListaDesejosService,
        private carrinhoService: CarrinhoService
    ) { }

    ngOnInit() {
        this.carregar();
    }

    carregar() {
        this.listaService.listar()
            .pipe(catchError(() => {
                this.erro.set('Não foi possível carregar sua lista de desejos.');
                return of([]);
            }))
            .subscribe(res => this.itens.set(res));
    }

    remover(cervejaId: number) {
        this.listaService.remover(cervejaId)
            .pipe(catchError(() => of(null)))
            .subscribe(() => {
                // atualiza a lista local sem recarregar do backend
                this.itens.set(this.itens().filter(i => i.cervejaId !== cervejaId));
                // atualiza o signal de favoritos também
                const atual = new Set(this.listaService.idsFavoritos());
                atual.delete(cervejaId);
                this.listaService.idsFavoritos.set(atual);
            });
    }

    adicionarCarrinho(cervejaId: number) {
        this.carrinhoService.adicionarItem(cervejaId, 1);
    }

    getImagemUrl(cervejariaId: number, imagem: string): string {
        return `${this.apiUrl}/uploads/images/${cervejariaId}/${imagem}`;
    }
}