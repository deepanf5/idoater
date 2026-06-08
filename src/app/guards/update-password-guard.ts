import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { supabase } from '../app.config';

export const updatePasswordGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const activeRouter = inject(ActivatedRoute);

  const accessToken = activeRouter.snapshot.queryParamMap.get('access_token');
  const refreshToken = activeRouter.snapshot.queryParamMap.get('refresh_token');
  console.log('accessToken', accessToken);
  console.log('refresh', refreshToken);
  if (accessToken && refreshToken) {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      return true;
    } catch (err) {
      // this.showError();
      router.navigate(['/sign-in']);
      return false;
    }
  } else {
    // thshowError();
    router.navigate(['/sign-in']);
    return false;
  }
};
