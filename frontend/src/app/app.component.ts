import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarreComponent } from './components/navbarre/navbarre.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
