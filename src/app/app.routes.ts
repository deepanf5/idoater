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
import { AddExpense } from './expense/add-expense/add-expense';
import { PageNotFound } from './common/page-not-found/page-not-found';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signIn',
    pathMatch: 'full',
  },
  {
    path: 'signIn',
    component: Login,
    title: 'sigIn',
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
    canActivate: [authGuard],

    children: [
      {
        path: '',
        component: TodoList,
        title: 'todoList',
        canActivate: [authGuard],
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./components/edit-todo/edit-todo').then((c) => c.EditTodo),
        title: 'editTodo',
        resolve: {
          todo: idolateResolver,
        },
        canActivate: [authGuard],
      },
      {
        path: 'createTodo',
        loadComponent: () => import('./components/todo-form/todo-form').then((c) => c.TodoForm),
        title: 'todo',
        canActivate: [authGuard],
      },
      {
        path: 'completedList',
        component: Completed,
        title: 'completed',
        canActivate: [authGuard],
      },
      {
        path: 'pendingList',
        component: PendingList,
        title: 'PendingList',
        canActivate: [authGuard],
      },
      {
        path: 'expenseTracker',
        component: ExpenseTracker,
        title: 'ExpenseTracker',
        canActivate: [authGuard],
      },
      {
        path: 'addExpense',
        component: AddExpense,
        title: 'addExpense',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
