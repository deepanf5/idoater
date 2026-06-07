import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs';

export const updatePasswordGuard: CanActivateFn = (route, state) => {
  const authS = inject(Auth);
  return authS.getUserSession().pipe(
    take(1),
    map((hasSession) => {
      if (hasSession) {
        console.log('hasSeesion', hasSession);
        return true;
      } else return false;
    }),
  );
};
