import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../core/services/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (!this.homeService.getHomeId()) {
      this.homeService.getHome().subscribe({
        next: (data) => {
          this.homeService.saveHomeId(data.id);
        },
        error: () => {
          this.router.navigate(['settings-home']);
        },
      });
    }
  }
}
