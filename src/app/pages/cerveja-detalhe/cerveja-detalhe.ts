import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap, switchMap, shareReplay } from 'rxjs';

import { CervejaService } from '../../services/cerveja';
import { Cerveja } from '../../models/cerveja';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cerveja-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cerveja-detalhe.html',
})
export class CervejaDetalheComponent {

  cerveja$!: Observable<Cerveja>;

  imagens: string[] = [];
  index = 0;

  constructor(
    private route: ActivatedRoute,
    private service: CervejaService
  ) {
    this.cerveja$ = this.route.paramMap.pipe(
      switchMap(params => this.service.buscarPorId(Number(params.get('id')))),
      tap(c => {
        if (this.imagens.length === 0) {
          this.imagens = [c.imagem_1, c.imagem_2, c.imagem_3].filter(Boolean);
          this.index = 0;
        }
      }),
      shareReplay(1)
    );
  }

  proxima() {
    if (this.imagens.length > 0) {
      this.index = (this.index + 1) % this.imagens.length;
    }
  }

  anterior() {
    if (this.imagens.length > 0) {
      this.index = (this.index - 1 + this.imagens.length) % this.imagens.length;
    }
  }

  getImagemUrl(cerveja: Cerveja): string {
    if (this.imagens.length === 0) return '';
    return `http://localhost:8080/uploads/images/${cerveja.cervejaria.id}/${this.imagens[this.index]}`;
  }
}



