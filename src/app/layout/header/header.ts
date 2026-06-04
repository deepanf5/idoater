import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Auth, loginStatus } from '../../services/auth';
import { Router } from '@angular/router';
import { supabase } from '../../app.config';

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

  constructor() {}

  ngOnInit(): void {}

  logOut() {
    this.authS.signOut();
    this.router.navigate(['/login']);
  }
}
