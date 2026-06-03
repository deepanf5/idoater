import { Component, inject, OnInit, signal } from '@angular/core';
import { Supbase } from '../../services/supbase';
import { Auth } from '../../services/auth';
import { map } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Todo } from '../todo-list/todo-list';

@Component({
  selector: 'app-pending-list',
  imports: [ScrollingModule],
  templateUrl: './pending-list.html',
  styleUrl: './pending-list.css',
})
export class PendingList implements OnInit {
  protected todoList = signal<Todo[]>([]);
  private supabaseS = inject(Supbase);
  private authS = inject(Auth);
  private id = this.authS.userId();
  private router = inject(Router);

  ngOnInit(): void {
    console.log('works');
    this.supabaseS
      .getTodoList()
      .pipe(
        map((res: any) => {
          const records = res?.data || res || [];
          return records.filter((todo: any) => todo.completed === false);
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

  getId(id: number) {
    this.router.navigate(['home/edit', id]);
  }
}
