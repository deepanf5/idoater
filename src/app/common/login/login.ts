import { Auth } from '../../services/auth';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly mode = signal({
    email: '',
    password: '',
  });
  authS = inject(Auth);
  router = inject(Router);
  protected readonly loginForm = form(this.mode, (schema) => {
    required(schema.email, { message: 'Eamil is required' });
    email(schema.email, { message: 'Please enter a valid Email address' });
    required(schema.password, { message: 'Password is required' });
  });

  protected onSubmitForm(event: SubmitEvent) {
    event.preventDefault();

    if (this.loginForm().invalid()) {
      return;
    }

    submit(this.loginForm, async () => {
      const formData = this.loginForm().value();
      this.authS.signIn(formData.email, formData.password).subscribe({
        next: (res: AuthResponse) => {
          if (res.data.user) {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    });
  }
}
