import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs';

export const updatePasswordGuard: CanActivateFn = (route, state) => {
  const authS = inject(Auth);
  const Activeroute = inject(ActivatedRoute);

  return false;
};
