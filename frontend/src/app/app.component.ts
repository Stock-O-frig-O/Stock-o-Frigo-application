import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarreComponent } from './components/navbarre/navbarre.component';
import { LogoComponent } from './components/logo/logo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarreComponent, LogoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
