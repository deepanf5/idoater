import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const user = await auth.getUser();
  return user.data.user?.id ? true : false;
};
