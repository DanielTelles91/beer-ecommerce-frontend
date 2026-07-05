import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap, switchMap, shareReplay } from 'rxjs';
import { CervejaService } from '../../services/cerveja.service';
import { Cerveja } from '../../models/cerveja.model';
import { RouterModule } from '@angular/router';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { ListaDesejosService } from '../../../lista-desejos/services/lista-desejos.service';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-cerveja-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cerveja-detalhe.html',
  styleUrl: './cerveja-detalhe.css'

})
export class CervejaDetalheComponent implements OnInit {

  cerveja$!: Observable<Cerveja>;

  imagens: string[] = [];
  index = 0;

  constructor(
    private route: ActivatedRoute,
    private service: CervejaService,
    private router: Router,
    public carrinhoService: CarrinhoService,
    public listaService: ListaDesejosService,
    public authService: AuthService
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

  ngOnInit() {

    if (this.authService.estaLogado() && this.listaService.idsFavoritos().size === 0) {
      this.listaService.carregarFavoritos();
    }
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
    return `${environment.apiUrl}/uploads/images/${cerveja.cervejaria.id}/${this.imagens[this.index]}`;
  }

  adicionarAoCarrinho(cervejaId: number) {
    this.carrinhoService.adicionarItem(cervejaId, 1);
  }

  toggleFavorito(cervejaId: number) {
    if (!this.authService.estaLogado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.listaService.toggleFavorito(cervejaId);
  }


}



