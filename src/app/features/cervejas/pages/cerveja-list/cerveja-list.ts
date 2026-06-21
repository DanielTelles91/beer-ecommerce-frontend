import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { CervejaService } from '../../services/cerveja.service';
import { Cerveja } from '../../models/cerveja.model';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cerveja-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cerveja-list.html',
  styleUrl: './cerveja-list.css'
})
export class CervejaListComponent {

  cervejas$!: Observable<any>;

  paginaAtual = 0;
  tamanho = 4;

  currentImageIndex: Record<number, number> = {};

  constructor(private service: CervejaService) {
    this.carregar();
  }

  carregar() {
    this.cervejas$ = this.service.listar(this.paginaAtual, this.tamanho);
  }

  proximaPagina(totalPages: number) {
    if (this.paginaAtual < totalPages - 1) {
      this.paginaAtual++;
      this.carregar();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.carregar();
    }
  }

  getImagemUrl(c: Cerveja, nome: string): string {
    return `http://localhost:8080/uploads/images/${c.cervejaria.id}/${nome}`;
  }
}