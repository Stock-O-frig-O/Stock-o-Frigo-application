import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../components/logo/logo.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';

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
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginPageComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private subscription: Subscription = new Subscription();

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public onSubmit(): void {
    this.subscription = this.authService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
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

  private ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
