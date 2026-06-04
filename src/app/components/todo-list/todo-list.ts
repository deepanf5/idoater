import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Supbase } from '../../services/supbase';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Todo {
  id: number;
  user_id: string;
  title: string;
  description: string;
  task_type: 'Low' | 'Medium' | 'High';
  completed: boolean;
  created_at: string;
}

@Component({
  selector: 'app-todo-list',
  imports: [ScrollingModule, CommonModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  protected todoList = signal<Todo[]>([]);
  private subaseS = inject(Supbase);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getAllTodo();
  }

  getId(id: number) {
    this.router.navigate(['home/edit', id]);
  }

  removeTodo(id: number) {
    this.subaseS.deleteTodo(id).subscribe({
      next: (res) => {
        if (res.status === 200 && res.success) {
          this.showSuccess();
          this.getAllTodo();
        }
      },
      error: (err) => {
        console.error(err);
        this.showError();
      },
    });
  }

  getAllTodo() {
    this.subaseS
      .getTodoList()
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          return of([]);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.data.length > 1) {
            this.todoList.set([...res.data]);
          }
        },
        error: (err: Error) => {
          this.Error();
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
    this.toastr.error('Oops! Lost data. Error');
  }
}
