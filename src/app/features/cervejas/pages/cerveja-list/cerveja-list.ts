import { Router } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CervejaService } from '../../services/cerveja.service';
import { Cerveja } from '../../models/cerveja.model';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FiltroLateralComponent } from '../../components/filtro-lateral/filtro-lateral';

@Component({
  selector: 'app-cerveja-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FiltroLateralComponent],
  templateUrl: './cerveja-list.html',
  styleUrl: './cerveja-list.css'
})
export class CervejaListComponent implements OnInit {

  cervejas = signal<Cerveja[]>([]);
  totalPages = signal<number>(0);

  paginaAtual = 0;
  tamanho = 6;

  termoAtual = '';
  paisAtual: string | null = null;
  sortAtual: string | null = null;

  constructor(
    private service: CervejaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.termoAtual = params['busca'] || '';
      this.paisAtual = params['pais'] || null;
      this.sortAtual = params['sort'] || null;
      this.paginaAtual = 0;
      this.buscarOuListar();
    });
  }

  private buscarOuListar() {
    if (this.termoAtual) {
      this.service.buscarPorNome(this.termoAtual, this.paginaAtual, this.tamanho, this.paisAtual ?? undefined, this.sortAtual ?? undefined)
        .subscribe((res: any) => {
          this.cervejas.set(res.content ?? res);
          this.totalPages.set(res.totalPages ?? 0);
        });
    } else {
      this.service.listar(this.paginaAtual, this.tamanho, this.paisAtual ?? undefined, this.sortAtual ?? undefined)
        .subscribe((res: any) => {
          this.cervejas.set(res.content);
          this.totalPages.set(res.totalPages);
        });
    }
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPages() - 1) {
      this.paginaAtual++;
      this.buscarOuListar();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.buscarOuListar();
    }
  }

  onPaisChange(pais: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pais },
      queryParamsHandling: 'merge'
    });
  }

  onSortChange(sort: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort },
      queryParamsHandling: 'merge'
    });
  }

  getImagemUrl(c: Cerveja, nome: string): string {
    return `http://localhost:8080/uploads/images/${c.cervejaria.id}/${nome}`;
  }
}