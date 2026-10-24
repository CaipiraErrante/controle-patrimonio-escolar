import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { InventoryPage } from './inventory.page';
import { LoginPage } from './login.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'patrimonios', component: InventoryPage, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'patrimonios' },
  { path: '**', redirectTo: 'patrimonios' },
];