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
  debounce,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  imports: [FormField, RouterLink],
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
  toastr = inject(ToastrService);
  protected isPasswordHidden = signal(true);

  protected signUpForm = form(this.model, (schema) => {
    required(schema.userName, { message: 'Type a username and join the fun' });
    minLength(schema.userName, 3, { message: 'Username too short… think bigger' });
    maxLength(schema.userName, 12, { message: 'Epic username alert! Keep it under 12' });
    required(schema.email, { message: '' });
    email(schema.email, { message: 'That doesn’t look like an email' });
    minLength(schema.password, 8, { message: 'Password please… we promise it stays secret.' });
    debounce(schema.password, 300);
    validate(schema.password, ({ value }) => {
      const password = value() ? value() : '';
      if (!password)
        return {
          kind: 'no_password',
          message: 'Hold up! Even superheroes need a password',
        };

      const pattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-\[\]{}|;:',.<>\/?_]).{8,}$/;

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
        next: (res: any) => {
          if (res.data.user) {
            this.showSuccess();
            this.router.navigate(['/signIn']);
          } else {
            this.showError();
          }
        },
        error: (err) => {
          console.error(err);
          this.showError();
        },
      });
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordHidden.set(!this.isPasswordHidden());
  }

  showSuccess() {
    this.toastr.success('Welcome! Let’s turn “I’ll do it later” into “done');
  }
  showError() {
    this.toastr.error('Sign up failed. Please try again later');
  }
}
