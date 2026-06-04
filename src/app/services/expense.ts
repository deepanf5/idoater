import { inject, Injectable, Injector } from '@angular/core';
import { expenseI } from '../expense/add-expense/add-expense';
import { Auth } from './auth';
import { supabase } from '../app.config';
import { filter, from, Observable, of, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Expense {
  authS = inject(Auth);
  id = this.authS.userId;
  private injector = inject(Injector);

  addExpense(formData: expenseI): Observable<any> {
    return from(
      supabase.from('expense').insert([
        {
          user_id: this.authS.userId() || null,
          category: formData.category,
          description: formData.description,
          amount: formData.amount,
        },
      ]),
    );
  }

  getExpenseList(): Observable<any> {
    return toObservable(this.authS.userId, { injector: this.injector }).pipe(
      filter((userId) => !!userId),
      switchMap(() => {
        if (!this.authS.userId) {
          return of([]);
        }

        return from(
          supabase
            .from('expense')
            .select('*')
            .eq('user_id', this.authS.userId())
            .order('created_at', { ascending: false }),
        );
      }),
    );
  }

  removeExpenseById(id: number): Observable<any> {
    return from(supabase.from('expense').delete().eq('id', id).select());
  }
}
