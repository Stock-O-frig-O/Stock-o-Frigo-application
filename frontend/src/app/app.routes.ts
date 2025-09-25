// Angular
import { Routes } from '@angular/router';

// Components
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { FavoritPageComponent } from './pages/favorit-page/favorit-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './core/guard/auth.guard';
import { SettingsHomePageComponent } from './pages/settings-home-page/settings-home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, canActivate: [authGuard] },

  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },

  {
    path: 'cart',
    component: CartPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'favorites',
    component: FavoritPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recipes',
    component: RecipePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'scan',
    component: ScanPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings-home',
    component: SettingsHomePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stock',
    component: StockPageComponent,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];
