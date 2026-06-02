import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  authS = inject(Auth);
  router = inject(Router);
  userDetails = signal<any>({});
  auth = inject(Auth);

  constructor() {}

  logOut() {
    this.authS.signOut();
    this.router.navigate(['/login']);
    this.auth.userData.set({});
  }

  ngOnInit(): void {
    this.auth.setUser();
    this.userDetails = this.authS.userData;
  }
}
