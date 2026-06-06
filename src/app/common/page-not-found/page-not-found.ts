import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
})
export class PageNotFound {
  private router = inject(Router);
  private authS = inject(Auth);

  goTo() {
    this.authS.userData().sub
      ? this.router.navigate(['/home'])
      : this.router.navigate(['/sign-in']);
  }
}
