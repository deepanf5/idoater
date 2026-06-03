import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Supbase } from '../../services/supbase';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  router = inject(Router);
  private supabse = inject(Supbase);
  ngOnInit(): void {
    this.getAllTodo();
  }

  getId(id: number) {
    this.router.navigate(['home/edit', id]);
  }

  removeTodo(id: number) {
    this.supabse.deleteTodo(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllTodo();
      },
      error: (err) => {
        console.error(err);
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
          this.todoList.set([...res.data]);
        },
        error: (err: Error) => {
          console.error(err.message);
        },
      });
  }
}
