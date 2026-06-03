import { inject, Injectable, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { supabase } from '../app.config';
import { Auth } from './auth';
import { from, Observable, of, switchMap } from 'rxjs';

export interface DoLaterI {
  title: string;
  description: string;
  completed: boolean;
  taskType: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class Supbase {
  authS = inject(Auth);
  private injector = inject(Injector);

  getTodoList(): Observable<any> {
    return toObservable(this.authS.userId, { injector: this.injector }).pipe(
      switchMap(() => {
        if (!this.authS.userId) {
          return of([]);
        }

        return from(
          supabase
            .from('idolater')
            .select('*')
            .eq('user_id', this.authS.userId())
            .order('created_at', { ascending: false }),
        );
      }),
    );
  }

  async createTodo(formData: DoLaterI): Promise<any> {
    const response = await supabase
      .from('idolater')
      .insert([
        {
          user_id: this.authS.userId() || null,
          title: formData.title,
          description: formData.description,
          completed: formData.completed,
          task_type: formData.taskType,
          created_at: formData.createdAt,
        },
      ])
      .select();
    return response;
  }

  updateTodo() {
    // return this.http.put("")
  }

  deleteTodo() {
    // return this.http.delete('');
  }
}
