import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Auth, loginStatus } from '../../services/auth';
import { Router } from '@angular/router';
import { supabase } from '../../app.config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  authS = inject(Auth);
  router = inject(Router);
  userDetails = this.authS.userData;
  private toastr = inject(ToastrService);

  constructor() {}

  ngOnInit(): void {}

  logOut() {
    this.authS.signOut().subscribe({
      next: (res) => {
        if (!res.error) {
          this.router.navigate(['/sign-in']);
          this.showSuccess();
        }
      },
      error: () => {
        this.showError();
      },
    });
  }

  showSuccess() {
    this.toastr.success('See you later! Your tasks will wait… impatiently.');
  }
  showError() {
    this.toastr.error('Logout failed. The app is’t ready to let you go ');
  }
}
