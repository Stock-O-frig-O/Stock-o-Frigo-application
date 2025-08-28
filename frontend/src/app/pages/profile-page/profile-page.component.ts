import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface DecodedUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  pictureUrl?: string;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FloatLabel,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Simple form holding user info (editable toggles per field)
  profileForm = this.fb.group({
    firstname: [''],
    lastname: [''],
    email: [''],
    password: ['••••••••'], // masked placeholder; real password not known
  });

  // Per-field edit mode flags
  isEditing = {
    firstname: false,
    lastname: false,
    email: false,
    password: false,
  };

  avatarUrl = '/imgs/avatar-placeholder.png';

  ngOnInit(): void {
    const token = this.authService.getToken();
    let decoded: DecodedUser | null = null;
    if (token) {
      try {
        decoded = jwtDecode<DecodedUser>(token);
      } catch {
        decoded = null;
      }
    }

    // Hydrate with whatever we have
    if (decoded) {
      if (decoded.firstname) this.profileForm.patchValue({ firstname: decoded.firstname });
      if (decoded.lastname) this.profileForm.patchValue({ lastname: decoded.lastname });
      if (decoded.email) this.profileForm.patchValue({ email: decoded.email });
      if (decoded.pictureUrl) this.avatarUrl = decoded.pictureUrl;
    }
  }

  toggleEdit(field: keyof typeof this.isEditing) {
    this.isEditing[field] = !this.isEditing[field];
  }

  navigateToGroups() {
    this.router.navigate(['/settings-home']);
  }
}
