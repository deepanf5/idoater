import { Component, inject, OnInit, signal } from '@angular/core';

import { DoLaterI, Supbase } from '../../services/supbase';
import { Auth } from '../../services/auth';
import { filter, map } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Todo } from '../todo-list/todo-list';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-completed',
  imports: [ScrollingModule],
  templateUrl: './completed.html',
  styleUrl: './completed.css',
})
export class Completed implements OnInit {
  protected todoList = signal<Todo[]>([]);
  private supabaseS = inject(Supbase);
  private toastr = inject(ToastrService);
  protected isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getCompletedTodo();
  }

  removeTodo(id: number) {
    this.supabaseS.deleteTodo(id).subscribe({
      next: (res) => {
        if (res.status === 200 && res.success) {
          this.showSuccess();
          this.getCompletedTodo();
        }
      },
      error: (err: Error) => {
        console.error(err);
        this.showError();
      },
    });
  }

  getCompletedTodo() {
    this.isLoading.set(true);
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
          this.isLoading.set(false);
          if (res.length >= 1) {
            this.todoList.set(res);
          } else if (res.length === 0) {
            this.todoList.set([]);
          } else {
            this.Error();
          }
        },
        error: (err: Error) => {
          this.Error();
          this.isLoading.set(false);
        },
      });
  }

  showSuccess() {
    this.toastr.success('Bye-bye! Task removed. Future you thanks you.');
  }
  showError() {
    this.toastr.error('Error, Task removal failed. It fought back.');
  }

  Error() {
    this.toastr.error('Oops! Lost data Error');
  }
}
