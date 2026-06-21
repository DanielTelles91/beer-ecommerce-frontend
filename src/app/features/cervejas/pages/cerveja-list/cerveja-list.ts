import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CervejaService } from '../../services/cerveja.service';
import { Cerveja } from '../../models/cerveja.model';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cerveja-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cerveja-list.html',
  styleUrl: './cerveja-list.css'
})
export class CervejaListComponent implements OnInit {

  cervejas: Cerveja[] = [];

  paginaAtual = 0;
  tamanho = 4;

  searchControl = new FormControl('');

  constructor(
    private service: CervejaService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.carregar();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        console.log('DIGITOU:', value);
        this.buscar(value || '');
      });
  }

  carregar() {
    this.service.listar(this.paginaAtual, this.tamanho)
      .subscribe((res: any) => {
        this.cervejas = res.content;
        this.totalPages = res.totalPages;

        this.cdr.detectChanges(); //  impo. nesse tipo de bug
      });
  }

  buscar(termo: string) {
    this.paginaAtual = 0; //  importante resetar pagina

    if (!termo || termo.trim() === '') {
      this.carregar();
      return;
    }

    this.service.buscarPorNome(termo)
      .subscribe((res: any) => {
        this.cervejas = res.content ?? res;
        this.totalPages = res.totalPages ?? 0;
      });
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
  totalPages = 0;
}