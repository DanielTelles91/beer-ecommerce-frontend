import { Router } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CervejaService } from '../../services/cerveja.service';
import { Cerveja } from '../../models/cerveja.model';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FiltroLateralComponent } from '../../components/filtro-lateral/filtro-lateral';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { environment } from '../../../../../environments/environment';
import { catchError, of } from 'rxjs';
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
  erro = signal<string | null>(null);

  paginaAtual = 0;
  tamanho = 6;

  termoAtual = '';
  paisAtual: string | null = null;
  sortAtual: string | null = null;

  constructor(
    private service: CervejaService,
    private route: ActivatedRoute,
    private router: Router,
    public carrinhoService: CarrinhoService
  ) { }

  adicionarAoCarrinho(cervejaId: number) {
    this.carrinhoService.adicionarItem(cervejaId, 1);
  }


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
    this.erro.set(null);

    const obs = this.termoAtual
      ? this.service.buscarPorNome(this.termoAtual, this.paginaAtual, this.tamanho, this.paisAtual ?? undefined, this.sortAtual ?? undefined)
      : this.service.listar(this.paginaAtual, this.tamanho, this.paisAtual ?? undefined, this.sortAtual ?? undefined);

    obs.pipe(
      catchError(() => {
        this.erro.set('Não foi possível carregar as cervejas. Verifique se o servidor está rodando.');
        return of({ content: [], totalPages: 0 });
      })
    ).subscribe((res: any) => {
      this.cervejas.set(res.content ?? res);
      this.totalPages.set(res.totalPages ?? 0);
    });
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
    return `${environment.apiUrl}/uploads/images/${c.cervejaria.id}/${nome}`;
  }




}