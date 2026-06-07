import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { supabase } from '../app.config';

export const updatePasswordGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  const hash = window.location.hash.substring(1);
  if (!hash) {
    router.navigate(['/sign-in']);
    return false;
  }

  // 2. Extract tokens swiftly using URLSearchParams
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    router.navigate(['/sign-in']);
    return false;
  }

  // 3. Establish session state in memory/storage before routing completes
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    console.error('Session establishment failed:', error.message);
    router.navigate(['/login']);
    return false;
  }

  // Session initialized successfully, permit routing to the component
  return true;
};
