import { Component, ViewEncapsulation, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG imports to match login/register forms
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabel,
    PasswordModule,
    ButtonModule,
    Toast,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  // Keep initial values to decide when the save button should be enabled
  private initialValues: { firstname: string; lastname: string; email: string } = {
    firstname: '',
    lastname: '',
    email: '',
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({
      photo: [null],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.securePasswordValidator()]],
      confirmPassword: [''],
    });

    // Disable fields by default (read-only until pen is clicked)
    this.form.get('firstname')?.disable({ emitEvent: false });
    this.form.get('lastname')?.disable({ emitEvent: false });
    this.form.get('email')?.disable({ emitEvent: false });
    this.form.get('password')?.disable({ emitEvent: false });
    this.form.get('confirmPassword')?.disable({ emitEvent: false });
  }

  // rxjs unsubscribe management
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Prefill from backend (with safe fallback to token)
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        const firstname = user.firstname || '';
        const lastname = user.lastname || '';
        const email = user.email || '';
        this.initialValues = { firstname, lastname, email };
        this.form.patchValue({ firstname, lastname, email });
        // Show masked placeholder for password when read-only
        this.form.get('password')?.setValue('********', { emitEvent: false });
        // If avatarUrl exists, set preview
        if (user.avatarUrl) {
          this.photoPreview = user.avatarUrl;
        }
      });
  }

  @ViewChild('firstnameInput') firstnameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('lastnameInput') lastnameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput?: ElementRef<HTMLInputElement>;

  private focusField(field: 'firstname' | 'lastname' | 'email' | 'password') {
    const map = {
      firstname: this.firstnameInput,
      lastname: this.lastnameInput,
      email: this.emailInput,
      password: this.passwordInput,
    } as const;
    const ref = map[field];
    if (ref?.nativeElement) {
      ref.nativeElement.focus();
    }
  }

  toggleEdit(field: 'firstname' | 'lastname' | 'email' | 'password') {
    const control = this.form.get(field);
    if (!control) return;
    if (control.disabled) {
      control.enable({ emitEvent: false });
      if (field === 'password') {
        // Clear placeholder so user can type a new password
        control.setValue('', { emitEvent: false });
        // Enable confirmPassword and clear it
        const c2 = this.form.get('confirmPassword');
        c2?.enable({ emitEvent: false });
        c2?.setValue('', { emitEvent: false });
      }
      // Focus input after enabling
      setTimeout(() => this.focusField(field));
    } else {
      control.disable({ emitEvent: false });
      if (field === 'password') {
        // Restore masked placeholder when disabling edit
        control.setValue('********', { emitEvent: false });
        // Disable and clear confirmPassword
        const c2 = this.form.get('confirmPassword');
        c2?.disable({ emitEvent: false });
        c2?.setValue('', { emitEvent: false });
      }
    }
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.form.patchValue({ photo: file });

    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = reader.result);
    reader.readAsDataURL(file);
  }

  // Enable save when a field is being edited or a photo is selected, and all enabled fields are valid.
  canSubmit(): boolean {
    const photoSelected = !!this.form.get('photo')?.value;

    const enabledControls = (['firstname', 'lastname', 'email', 'password', 'confirmPassword'] as const)
      .map((key) => this.form.get(key))
      .filter((c): c is NonNullable<typeof c> => !!c && c.enabled);

    // If password is being edited, require confirmPassword to match
    const passwordCtrl = this.form.get('password');
    const confirmCtrl = this.form.get('confirmPassword');
    const passwordMode = !!passwordCtrl && passwordCtrl.enabled;
    const passwordsMatch = !passwordMode || (passwordCtrl?.value && confirmCtrl?.value && passwordCtrl.value === confirmCtrl.value);

    const allEnabledValid = enabledControls.every((c) => c.valid) && passwordsMatch;

    return (photoSelected || enabledControls.length > 0) && allEnabledValid;
  }

  goToGroup() {
    this.router.navigate(['/settings-home']);
  }

  submit() {
    if (!this.canSubmit()) {
      return;
    }

    // Build update payload with only enabled fields
    type UpdatableKey = 'firstname' | 'lastname' | 'email' | 'password' | 'confirmPassword';
    const update: Partial<Record<UpdatableKey, string>> & { photoFile?: File | null } = {};

    (['firstname', 'lastname', 'email', 'password', 'confirmPassword'] as const).forEach((key) => {
      const control = this.form.get(key);
      if (control && control.enabled) {
        const value = control.value as string;
        if (value !== undefined && value !== null && value !== '') {
          update[key] = value;
        }
      }
    });

    const photoControl = this.form.get('photo');
    if (photoControl?.value) {
      update.photoFile = photoControl.value as File;
    }

    this.authService
      .updateUserProfile(update)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Profil enregistré.',
            key: 'br',
            life: 3000,
          });
          // Re-disable fields after saving
          this.form.get('firstname')?.disable({ emitEvent: false });
          this.form.get('lastname')?.disable({ emitEvent: false });
          this.form.get('email')?.disable({ emitEvent: false });
          this.form.get('password')?.disable({ emitEvent: false });
          // Clear photo selection
          this.form.get('photo')?.reset(null);
          // Refresh profile data and reset initial values
          this.authService
            .getUserProfile()
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => {
              // Preserve existing values if backend omits some fields (common after email change)
              const currentFirstname = this.form.get('firstname')?.value || this.initialValues.firstname || '';
              const currentLastname = this.form.get('lastname')?.value || this.initialValues.lastname || '';
              const currentEmail = this.form.get('email')?.value || this.initialValues.email || '';

              const firstname = (user.firstname ?? currentFirstname) || '';
              const lastname = (user.lastname ?? currentLastname) || '';
              const email = (user.email ?? currentEmail) || '';

              this.initialValues = { firstname, lastname, email };
              this.form.patchValue({ firstname, lastname, email });
              if (user.avatarUrl) {
                this.photoPreview = user.avatarUrl;
              }
            });
        },
        error: (err) => {
          console.error('Update profile error:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Une erreur est survenue lors de l'enregistrement du profil.",
            key: 'br',
            life: 3000,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Same password security rules as registration
  private securePasswordValidator() {
    return (control: import('@angular/forms').AbstractControl): import('@angular/forms').ValidationErrors | null => {
      const value = control.value || '';
      if (value === '********') {
        // Placeholder when field is disabled; do not invalidate
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 8;
      const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;
      return passwordValid ? null : { securePassword: true };
    };
  }
}
