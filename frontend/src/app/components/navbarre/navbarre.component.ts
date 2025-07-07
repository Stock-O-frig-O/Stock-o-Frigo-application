import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarre',
  imports: [CommonModule],
  templateUrl: './navbarre.component.html',
  styleUrl: './navbarre.component.scss',
})
export class NavbarreComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private route: Router = inject(Router);

  isRouteActive = '/';

  ngOnInit() {
    this.route.events.subscribe(() => {
      // Update the isRouteActive property whenever the route changes
      // This will allow us to highlight the active route in the template
      this.isRouteActive = this.route.url;
    });
  }

  public goToPage(route: string) {
    // Navigate to the specified route
    // This will update the URL and the view accordingly
    this.route.navigate([`${route}`]);
  }

  ngOnDestroy() {
    // Clean up the subscription to avoid memory leaks
    // This is important to ensure that we do not keep listening to route changes
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
