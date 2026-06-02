import { inject, Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { Auth } from './auth';
import { from } from 'rxjs';

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

  getTodo() {
    console.log('userId++', this.authS.userId());
    return from(supabase.from('do_later').select('*').eq('user_id', this.authS.userId()));
  }

  async createTodo(formData: DoLaterI): Promise<any> {
    const response = await supabase
      .from('do_later')
      .insert([
        {
          user_id: this.authS.userId(),
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
