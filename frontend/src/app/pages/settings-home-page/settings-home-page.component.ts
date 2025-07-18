// Angular imports
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Prime ng imports
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

// Local imports
import { HomeService } from '../../core/services/home.service';
import { Home } from '../../core/model/Home.model';

// RXJS import
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings-home-page',
  imports: [Dialog, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './settings-home-page.component.html',
  styleUrl: './settings-home-page.component.scss',
})
export class SettingsHomePageComponent implements OnInit, OnDestroy {
  // Service injection
  private homeService = inject(HomeService);

  // use to unsubscibe
  destroy$ = new Subject<void>();

  homeData!: Home;
  visible = false;
  chosenName!: string;

  ngOnInit() {
    this.homeService
      .getHome()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.homeData = data;
      });
  }

  showDialog() {
    this.visible = true;
  }

  save() {
    this.homeService
      .createHome(this.chosenName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.visible = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création du home:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
