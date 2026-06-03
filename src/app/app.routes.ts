import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoForm } from './components/todo-form/todo-form';
import { Layout } from './layout/layout/layout';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import { EditTodo } from './components/edit-todo/edit-todo';
import { idolateResolver } from './resolver/resolver';
import { Completed } from './components/completed/completed';
import { PendingList } from './components/pending-list/pending-list';
import { ExpenseTracker } from './components/expense-tracker/expense-tracker';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((c) => c.Login),
    title: 'login',
  },
  {
    path: 'signUp',
    loadChildren: () => import('./components/sign-up/sign-up').then((c) => c.SignUp),
    title: 'singUp',
  },
  {
    path: 'home',
    loadComponent: () => import('./layout/layout/layout').then((c) => c.Layout),
    title: 'Home',
    loadChildren: () => [
      {
        path: '',
        loadChildren: () => import('./components/todo-list/todo-list').then((c) => c.TodoList),
        title: 'todoList',
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./components/edit-todo/edit-todo').then((c) => c.EditTodo),
        title: 'editTodo',
        resolve: {
          todo: idolateResolver,
        },
      },
      {
        path: 'createTodo',
        loadChildren: () => import('./components/todo-form/todo-form').then((c) => c.TodoForm),
        title: 'todo',
      },
      {
        path: 'completedList',
        loadChildren: () => import('./components/completed/completed').then((c) => c.Completed),
        title: 'completed',
      },
      {
        path: 'pendingList',
        loadChildren: () =>
          import('./components/pending-list/pending-list').then((c) => c.PendingList),
        title: 'PendingList',
      },
      {
        path: 'expenseTracker',
        loadChildren: () =>
          import('./components/expense-tracker/expense-tracker').then((c) => c.ExpenseTracker),
        title: 'ExpenseTracker',
      },
    ],
  },
];
