import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';

export interface UpdatePasswordI {
  password: string;
  confirmpassword: string;
}

@Component({
  selector: 'app-update-password',
  imports: [FormField],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css',
})
export class UpdatePassword implements OnInit {
  private model = signal<UpdatePasswordI>({
    password: '',
    confirmpassword: '',
  });

  protected isPasswordHidden = signal(true);
  protected isConfirmHidden = signal(true);
  private authS = inject(Auth);
  private toastr = inject(ToastrService);

  ngOnInit() {}

  protected readonly passwordForm = form(this.model, (schema) => {
    required(schema.password, { message: 'Type your password or no magic for you' });
    required(schema.confirmpassword, { message: 'Type your password or no magic for you' });
    validate(schema.password, ({ value }) => {
      const password = value();
      if (!password) return null;
      if (password.toString().includes(' ')) {
        return {
          kind: 'no_spaces',
          message: 'Oops! Password hates empty space',
        };
      }
      return null;
    });
    validate(schema.confirmpassword, ({ value, valueOf }) => {
      const confrimPassowrd = value();
      const password = valueOf(schema.password);
      if (!password || !password) return null;
      if (password !== confrimPassowrd) {
        return {
          kind: 'password_missMatch',
          message: 'Your passwords are fighting again',
        };
      }
      return null;
    });
  });

  togglePasswordVisibility() {
    this.isPasswordHidden.set(!this.isPasswordHidden());
  }
  togglePasswordconfirm() {
    this.isConfirmHidden.set(!this.isConfirmHidden());
  }

  onSubmitForm(event: SubmitEvent) {
    event.preventDefault();

    if (this.passwordForm().invalid()) {
      return;
    }
    submit(this.passwordForm, async () => {
      const formDate = this.passwordForm().value();

      this.authS.updatePassword(formDate.password).subscribe({
        next: (res) => {
          if (res.data) {
            this.showSuccess();
          } else {
            this.error(res.error?.message);
          }
        },
        error: (err) => {
          this.showError();
        },
      });
    });
  }

  showSuccess() {
    this.toastr.success('Success! The reset link is on its way', '', {
      timeOut: 700,
    });
  }
  showError() {
    this.toastr.error('Something went wrong. Even the internet has bad days');
  }
  error(message: string) {
    this.toastr.error(message);
  }
}
