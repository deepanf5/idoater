import { Component, inject, model, signal } from '@angular/core';
import { email, form, FormField, required, schema, submit } from '@angular/forms/signals';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  imports: [FormField],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  protected Emodel = signal({
    email: '',
  });

  showReset = model.required<boolean>();
  private auth = inject(Auth);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  protected readonly reseForm = form(this.Emodel, (schema) => {
    required(schema.email, { message: 'Email required. Don’t make us beg' });
    email(schema.email, { message: `Hmm... that doesn't look like a valid email address` });
  });

  onsubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.reseForm().invalid()) {
      return;
    }

    submit(this.reseForm, async () => {
      const formData = this.reseForm().value();
      this.auth.sentResetLink(formData.email).subscribe({
        next: (res) => {
          if (res.data) {
            this.showReset.set(false);
            this.router.navigate(['/sign-in']);
            this.showSuccess();
          } else {
            this.showError();
          }
        },
        error: (err: Error) => {
          this.error(err.message);
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
