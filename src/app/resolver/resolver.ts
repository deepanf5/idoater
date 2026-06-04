import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Supbase } from '../services/supbase';

export const idolateResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  const id = Number(route.paramMap.get('id'));
  const subabaseS = inject(Supbase);
  if (!id) return;
  return subabaseS.getTodoById(id);
};
