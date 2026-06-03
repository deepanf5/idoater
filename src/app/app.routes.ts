import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoForm } from './components/todo-form/todo-form';
import { Layout } from './layout/layout/layout';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import { EditTodo } from './components/edit-todo/edit-todo';
import { idolateResolver } from './resolver/resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    title: 'login',
  },
  {
    path: 'signUp',
    component: SignUp,
    title: 'singUp',
  },
  {
    path: 'home',
    component: Layout,
    title: 'Home',
    loadChildren: () => [
      {
        path: '',
        component: TodoList,
        title: 'todoList',
      },
      {
        path: 'edit/:id',
        component: EditTodo,
        title: 'editTodo',
        resolve: {
          todo: idolateResolver,
        },
      },
      {
        path: 'createTodo',
        component: TodoForm,
        title: 'todo',
      },
    ],
  },
];
