import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval } from 'rxjs';

import { CervejaService } from '../../services/cerveja';
import { Cerveja } from '../../models/cerveja';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cerveja-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cerveja-list.html'
})
export class CervejaListComponent {

  cervejas$!: Observable<Cerveja[]>;
  tick$ = interval(3000);

  currentImageIndex: Record<number, number> = {};

  constructor(private service: CervejaService) {
    this.cervejas$ = this.service.listar();
  }

  getImagemUrl(c: Cerveja, nome: string): string {
    return `http://localhost:8080/uploads/images/${c.cervejaria.id}/${nome}`;
  }

  getCurrentImage(c: Cerveja, _tick: number): string | null {
    const imagens = [c.imagem_1, c.imagem_2, c.imagem_3].filter(Boolean);
    if (imagens.length === 0) return null;

    const key = c.cervejaria.id;

    if (this.currentImageIndex[key] === undefined) {
      this.currentImageIndex[key] = 0;
    } else {
      this.currentImageIndex[key] = (this.currentImageIndex[key] + 1) % imagens.length;
    }

    return imagens[this.currentImageIndex[key]];
  }
}




