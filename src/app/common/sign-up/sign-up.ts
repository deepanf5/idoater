import { Auth } from './../../services/auth';
import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  required,
  validate,
  FormField,
  minLength,
  submit,
  maxLength,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthResponse } from '@supabase/supabase-js';

enum userLogin {
  Auth = 'authenticated',
}

export interface accountFormI {
  userName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-up',
  imports: [FormField],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  protected readonly model = signal<accountFormI>({
    userName: '',
    email: '',
    password: '',
  });

  authS = inject(Auth);
  router = inject(Router);

  protected signUpForm = form(this.model, (schema) => {
    required(schema.userName, { message: 'UserName is required' });
    minLength(schema.userName, 3, { message: 'User mininum 3 character' });
    maxLength(schema.userName, 150, { message: 'User Max char 150 character' });
    required(schema.email, { message: 'Password is required' });
    email(schema.email, { message: 'Please Enter a Valid Email' });
    minLength(schema.password, 8, { message: 'Password must be 8 char' });
    validate(schema.password, ({ value }) => {
      const password = value ? value.toString() : '';
      if (!password) return null;

      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!pattern.test(password)) {
        return {
          kind: 'weak_password',
          message:
            'Password must contain at least one lowercase, one uppercase, one number, and one symbol',
        };
      }
      return null;
    });
  });

  protected onSubmitForm(event: SubmitEvent) {
    event.preventDefault();

    if (this.signUpForm().invalid()) {
      return;
    }

    submit(this.signUpForm, async () => {
      const formData = this.signUpForm().value();
      this.authS.signUp(formData.email, formData.password, formData.userName).subscribe({
        next: (res: AuthResponse) => {
          if (res.data.user?.aud === userLogin.Auth) {
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
