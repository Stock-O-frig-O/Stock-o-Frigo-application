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

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent },

  { path: 'cart', component: CartPageComponent },
  { path: 'favorites', component: FavoritPageComponent },
  { path: 'recipes', component: RecipePageComponent },
  { path: 'scan', component: ScanPageComponent },
  { path: 'stock', component: StockPageComponent },
  
  { path: '**', redirectTo: '' },
];
