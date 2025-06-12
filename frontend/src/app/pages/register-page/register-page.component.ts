import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LogoComponent } from '../../components/logo/logo.component';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    LogoComponent,
    InputTextModule,
    FloatLabel,
    Checkbox,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.formBuilder.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    legals: ['', [Validators.required]],
    passwords: this.formBuilder.group(
      {
        password: ['', [Validators.required, this.securePasswordValidator()]],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator() },
    ),
  });

  onSubmit(): void {
    this.authService
      .register(
        this.registerForm.value.firstname!,
        this.registerForm.value.lastname!,
        this.registerForm.value.email!,
        this.registerForm.value.passwords!.password!,
      )
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (err) => {
          alert('Une erreur est survenue.');
          console.error('Error: ', err);
        },
      });
  }

  securePasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid =
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        isValidLength;

      return passwordValid ? null : { securePassword: true };
    };
  }

  passwordMatchValidator(): ValidatorFn {
    return (createPasswordForm: AbstractControl): ValidationErrors | null => {
      const password = createPasswordForm.get('password')?.value;
      const confirmPassword = createPasswordForm.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }
}
