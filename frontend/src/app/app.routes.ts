import { Routes } from '@angular/router';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FavoritPageComponent } from './pages/favorit-page/favorit-page.component';
import { ScanPageComponent } from './pages/scan-page/scan-page.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'favorites', component: FavoritPageComponent },
  { path: 'recipes', component: RecipePageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'scan', component: ScanPageComponent },
];
