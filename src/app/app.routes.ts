import { Routes } from '@angular/router';
import { CervejaListComponent } from './features/cervejas/pages/cerveja-list/cerveja-list';
import { CervejaDetalheComponent } from './features/cervejas/pages/cerveja-detalhe/cerveja-detalhe';

export const routes: Routes = [
  { path: '', redirectTo: 'cervejas', pathMatch: 'full' },
  { path: 'cervejas', component: CervejaListComponent },
  { path: 'cervejas/:id', component: CervejaDetalheComponent }
];