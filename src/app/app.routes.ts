import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoForm } from './components/todo-form/todo-form';
import { Layout } from './layout/layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Layout,
    loadChildren: () => [
      {
        path: '',
        component: TodoList,
      },
      {
        path: 'createTodo',
        component: TodoForm,
      },
    ],
  },
];
