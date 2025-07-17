import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../core/services/home.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-home-page',
  imports: [Dialog, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './settings-home-page.component.html',
  styleUrl: './settings-home-page.component.scss',
})
export class SettingsHomePageComponent implements OnInit {
  private homeService = inject(HomeService);
  public homeData!: string[];
  public visible = false;
  public chosenName!: string;

  ngOnInit() {
    this.homeService.getHome().subscribe((data) => {
      this.homeData = data;
    });
  }

  showDialog() {
    this.visible = true;
  }

  save() {
    this.homeService.createHome(this.chosenName).subscribe({
      next: () => {
        this.visible = false;
      },
      error: (error) => {
        console.error('Erreur lors de la création du home:', error);
      },
    });
  }
}
