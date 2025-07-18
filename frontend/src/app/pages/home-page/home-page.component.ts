import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../core/services/home.service';
import { Router } from '@angular/router';
import { Home } from '../../core/model/Home.model';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly router = inject(Router);

  private homeData!: Home;

  ngOnInit(): void {
    this.homeService.getHome().subscribe({
      next: (data) => {
        console.log(data);

        this.homeData = data;
        this.homeService.saveHomeId(data.id);
      },
    });

    if (!this.homeService.getHomeId()) {
      this.router.navigate(['settings-home']);
    }
  }
}
