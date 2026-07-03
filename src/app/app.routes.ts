import { Routes } from '@angular/router';
import { CervejaListComponent } from './features/cervejas/pages/cerveja-list/cerveja-list';
import { CervejaDetalheComponent } from './features/cervejas/pages/cerveja-detalhe/cerveja-detalhe';
import { CarrinhoPageComponent } from './features/carrinho/pages/carrinho-page/carrinho-page';
import { DefinirSenhaComponent } from './features/auth/pages/definir-senha/definir-senha';
import { CadastroComponent } from './features/auth/pages/cadastro/cadastro';
import { ConfirmarEmailComponent } from './features/auth/pages/cadastro/confirmar-email';
import { LoginComponent } from './features/auth/pages/login/login';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MinhaContaComponent } from './features/auth/pages/minha-conta/minha-conta';
import { AguardandoConfirmacaoComponent } from './features/auth/pages/cadastro/aguardando-confirmacao';
import { CheckoutComponent } from './features/pedidos/pages/checkout/checkout';
import { MeusPedidosComponent } from './features/pedidos/pages/meus-pedidos/meus-pedidos';




export const routes: Routes = [
  { path: '', redirectTo: 'cervejas', pathMatch: 'full' },
  { path: 'cervejas', component: CervejaListComponent },
  { path: 'cervejas/:id', component: CervejaDetalheComponent },
  { path: 'carrinho', component: CarrinhoPageComponent },
  { path: 'definir-senha', component: DefinirSenhaComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'confirmar-email', component: ConfirmarEmailComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'cadastro', component: CadastroComponent, canActivate: [guestGuard] },
  { path: 'confirmar-email', component: ConfirmarEmailComponent },
  { path: 'definir-senha', component: DefinirSenhaComponent },
  { path: 'minha-conta', component: MinhaContaComponent, canActivate: [authGuard] },
  { path: 'aguardando-confirmacao', component: AguardandoConfirmacaoComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'meus-pedidos', component: MeusPedidosComponent, canActivate: [authGuard] }


];

