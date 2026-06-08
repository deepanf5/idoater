import { ActivatedRoute, Router } from '@angular/router';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { supabase } from '../../app.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private activeRouter = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  async ngOnInit() {
    const accessToken = this.activeRouter.snapshot.queryParamMap.get('access_token');
    const refreshToken = this.activeRouter.snapshot.queryParamMap.get('refresh_token');
    console.log('accessToken', accessToken);
    console.log('refresh', refreshToken);
    if (accessToken && refreshToken) {
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          this.showError();
          this.router.navigate(['/sign-in']);
        }
      } catch (err) {
        this.showError();
        this.router.navigate(['/sign-in']);
      }
    } else {
      this.showError();
      this.router.navigate(['/sign-in']);
    }
  }

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
          if (res.error.__isAuthError) {
            this.error(res.error?.message);
          } else {
            this.showSuccess();
          }
        },
        error: (err) => {
          this.showError();
        },
      });
    });
  }

  showSuccess() {
    this.toastr.success('Password updated! Good luck typing that again', '', {
      timeOut: 700,
    });
  }
  showError() {
    this.toastr.error('Error, that didn’t work. Shocking, right?');
  }
  error(message: string) {
    this.toastr.error(message);
  }
}
