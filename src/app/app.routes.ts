import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoForm } from './components/todo-form/todo-form';
import { Layout } from './layout/layout/layout';
import { Login } from './common/login/login';
import { EditTodo } from './components/edit-todo/edit-todo';
import { idolateResolver } from './resolver/resolver';
import { Completed } from './components/completed/completed';
import { PendingList } from './components/pending-list/pending-list';
import { ExpenseTracker } from './expense/expense-tracker/expense-tracker';
import { SignUp } from './common/sign-up/sign-up';

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
    children: [
      {
        path: '',
        component: TodoList,
        title: 'todoList',
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./components/edit-todo/edit-todo').then((c) => c.EditTodo),
        title: 'editTodo',
        resolve: {
          todo: idolateResolver,
        },
      },
      {
        path: 'createTodo',
        loadComponent: () => import('./components/todo-form/todo-form').then((c) => c.TodoForm),
        title: 'todo',
      },
      {
        path: 'completedList',
        component: Completed,
        title: 'completed',
      },
      {
        path: 'pendingList',
        component: PendingList,
        title: 'PendingList',
      },
      {
        path: 'expenseTracker',
        component: ExpenseTracker,
        title: 'ExpenseTracker',
      },
    ],
  },
];
