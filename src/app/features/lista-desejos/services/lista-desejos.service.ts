import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ListaDesejos } from '../models/lista-desejos.model';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListaDesejosService {

    private apiUrl = `${environment.apiUrl}/api/lista-desejos`;

    // signal com os ids das cervejas na lista (usado pra mostrar coração cheio/vazio)
    idsFavoritos = signal<Set<number>>(new Set());

    constructor(private http: HttpClient) { }

    listar() {
        return this.http.get<ListaDesejos[]>(this.apiUrl);
    }

    carregarFavoritos() {
        this.listar()
            .pipe(catchError(() => of([])))
            .subscribe(itens => {
                this.idsFavoritos.set(new Set(itens.map(i => i.cervejaId)));
            });
    }

    estaFavorito(cervejaId: number): boolean {
        return this.idsFavoritos().has(cervejaId);
    }

    adicionar(cervejaId: number) {
        return this.http.post(`${this.apiUrl}/${cervejaId}`, {}, { responseType: 'text' });
    }

    remover(cervejaId: number) {
        return this.http.delete(`${this.apiUrl}/${cervejaId}`, { responseType: 'text' });
    }

    toggleFavorito(cervejaId: number) {
        if (this.estaFavorito(cervejaId)) {
            this.remover(cervejaId).subscribe(() => {
                const atual = new Set(this.idsFavoritos());
                atual.delete(cervejaId);
                this.idsFavoritos.set(atual);
            });
        } else {
            this.adicionar(cervejaId).subscribe(() => {
                const atual = new Set(this.idsFavoritos());
                atual.add(cervejaId);
                this.idsFavoritos.set(atual);
            });
        }
    }
}