import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { supabase } from '../../app.config';
import { Auth } from '../../services/auth';
import { Supbase } from '../../services/supbase';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  todoList = signal<any[]>([]);
  subaseS = inject(Supbase);
  ngOnInit(): void {
    this.subaseS.getTodo().subscribe({
      next: (res: any) => {
        console.log(res);
        // this.todoList.set([...res.data]);
      },
    });
  }
}
