import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoForm } from './components/todo-form/todo-form';
import { Layout } from './layout/layout/layout';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signUp',
    component: SignUp,
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
