import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CarrinhoService } from '../../../features/carrinho/services/carrinho.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class NavbarComponent {

  searchControl = new FormControl('');
  open = false; //  controla dropdown

  constructor(
    private router: Router,
    public carrinhoService: CarrinhoService
  ) {

    //  busca
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(termo => {
        this.router.navigate(['/cervejas'], {
          queryParams: { busca: termo || null },
          queryParamsHandling: 'merge'
        });
      });
  }

  //  remover item do carrinho
  remover(itemId: number) {
    this.carrinhoService.removerItem(itemId);
  }
}
