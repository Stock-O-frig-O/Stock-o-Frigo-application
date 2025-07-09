import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../components/logo/logo.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    LogoComponent,
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
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private subscription: Subscription = new Subscription();
  private router = inject(Router);
  private messageService = inject(MessageService);

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public onSubmit(): void {
    this.subscription = this.authService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe({
        next: () => {
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
    this.subscription.unsubscribe();
  }
}
