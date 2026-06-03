import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Supbase } from '../../services/supbase';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  todoList = signal<Todo[]>([]);
  subaseS = inject(Supbase);
  ngOnInit(): void {
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
          console.log(res);
          this.todoList.set([...res.data]);
        },
      });
  }
}
