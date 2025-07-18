// Angular imports
import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// RXJS imports
import { Subject, takeUntil } from 'rxjs';

// Prime ng imports
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

// local imports
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    PasswordModule,
    RouterModule,
    Toast,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class LoginPageComponent implements OnDestroy {
  // Service injections
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Use to unsubscribe
  destroy$ = new Subject<void>();

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public onSubmit(): void {
    this.authService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.authService.saveHomeId();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error: ', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error,
            key: 'br',
            life: 3000,
          });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
