import { Component, inject, OnInit, signal } from '@angular/core';
import { Supbase } from '../../services/supbase';
import { Auth } from '../../services/auth';
import { map } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Todo } from '../todo-list/todo-list';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-list',
  imports: [ScrollingModule],
  templateUrl: './pending-list.html',
  styleUrl: './pending-list.css',
})
export class PendingList implements OnInit {
  protected todoList = signal<Todo[]>([]);
  private supabaseS = inject(Supbase);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  protected isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getPendingTaskList();
  }

  removeTodo(id: number) {
    this.supabaseS.deleteTodo(id).subscribe({
      next: (res) => {
        if (res.status === 200 && res.success) {
          this.showSuccess();
          this.getPendingTaskList();
        } else {
          this.showError();
        }
      },
      error: (err: Error) => {
        this.showError();
      },
    });
  }

  getPendingTaskList() {
    this.isLoading.set(true);
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
          this.todoList.set([...res]);
          this.isLoading.set(false);
          if (res.length >= 1) {
          } else if (res.length === 0) {
            this.todoList.set([]);
          } else {
            this.Error();
          }
        },
        error: (err: Error) => {
          this.showError();
          this.isLoading.set(false);
        },
      });
  }

  getId(id: number) {
    this.router.navigate(['home/edit', id]);
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
