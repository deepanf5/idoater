import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface DoLaterI {
  title: string;
  desciption: string;
  completed: boolean;
  taskType: string;
  createAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FirbaseS {
  private http = inject(HttpClient);
  // private fireStore = inject();

  getTodo() {
    return this.http.get('');
  }

  createTodo() {
    // return this.http.post("")
  }

  updateTodo() {
    // return this.http.put("")
  }

  deleteTodo() {
    return this.http.delete('');
  }
}
