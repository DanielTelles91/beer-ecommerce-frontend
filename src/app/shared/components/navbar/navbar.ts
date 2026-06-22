import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  searchControl = new FormControl('');

  constructor(private router: Router) {
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
}
