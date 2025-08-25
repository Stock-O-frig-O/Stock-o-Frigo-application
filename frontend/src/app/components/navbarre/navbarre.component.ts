// rxjs imports
import { Subject, takeUntil } from 'rxjs';

// Angular imports
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Local imports
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbarre',
  imports: [CommonModule],
  templateUrl: './navbarre.component.html',
  styleUrl: './navbarre.component.scss',
})
export class NavbarreComponent implements OnInit, OnDestroy {
  // Service injection
  private route: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  // Use to unsubscribe
  destroy$ = new Subject<void>();

  // use to follow the active route
  isRouteActive = '/';

  ngOnInit() {
    this.route.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Update the isRouteActive property whenever the route changes
      // This will allow us to highlight the active route in the template
      this.isRouteActive = this.route.url;
    });
  }

  // Navigate to the specified route
  public goToPage(route: string) {
    this.route.navigate([`${route}`]);
  }

  ngOnDestroy() {
    // Clean up the subscription to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
