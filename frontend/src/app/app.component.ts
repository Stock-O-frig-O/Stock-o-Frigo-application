// import Angular
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import components
import { NavbarreComponent } from './components/navbarre/navbarre.component';
import { LogoComponent } from './components/logo/logo.component';

// import services
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarreComponent, LogoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // sercice injection
  public authService: AuthService = inject(AuthService);
}
