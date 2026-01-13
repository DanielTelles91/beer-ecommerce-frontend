import { Routes } from '@angular/router';
import { CervejaListComponent } from './pages/cerveja-list/cerveja-list';
import { CervejaDetalheComponent } from './pages/cerveja-detalhe/cerveja-detalhe';

export const routes: Routes = [
  { path: '', redirectTo: 'cervejas', pathMatch: 'full' },
  { path: 'cervejas', component: CervejaListComponent },
  { path: 'cervejas/:id', component: CervejaDetalheComponent }
];