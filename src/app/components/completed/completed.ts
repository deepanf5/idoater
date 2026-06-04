import { Component, inject, OnInit, signal } from '@angular/core';

import { DoLaterI, Supbase } from '../../services/supbase';
import { Auth } from '../../services/auth';
import { filter, map } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Todo } from '../todo-list/todo-list';

@Component({
  selector: 'app-completed',
  imports: [ScrollingModule],
  templateUrl: './completed.html',
  styleUrl: './completed.css',
})
export class Completed implements OnInit {
  todoList = signal<Todo[]>([]);
  supabaseS = inject(Supbase);
  authS = inject(Auth);
  id = this.authS.userId();

  ngOnInit(): void {
    console.log('works');
    this.supabaseS
      .getTodoList()
      .pipe(
        map((res: any) => {
          const records = res?.data || res || [];
          return records.filter((todo: any) => todo.completed === true);
        }),
      )
      .subscribe({
        next: (res) => {
          this.todoList.set(res);
        },
        error: (err: Error) => {
          console.error(err.message);
        },
      });
  }

  removeTodo(id: number) {
    this.supabaseS.deleteTodo(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
  }
}
