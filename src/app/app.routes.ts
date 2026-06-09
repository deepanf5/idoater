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
import { unAuthGuard } from './guards/un-auth-guard';
import { UpdatePassword } from './common/update-password/update-password';
import { updatePasswordGuard } from './guards/update-password-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: Login,
    title: 'sign-in',
    canActivate: [unAuthGuard],
  },
  {
    path: 'sign-up',
    component: SignUp,
    title: 'sign-up',
    canActivate: [unAuthGuard],
  },
  {
    path: 'update-password',
    component: UpdatePassword,
    title: 'updatePassword',
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
      },
      {
        path: 'create-todo',
        loadComponent: () => import('./components/todo-form/todo-form').then((c) => c.TodoForm),
        title: 'todo',
      },
      {
        path: 'completed-list',
        component: Completed,
        title: 'completed',
      },
      {
        path: 'pending-list',
        component: PendingList,
        title: 'PendingList',
      },
      {
        path: 'expense-tracker',
        component: ExpenseTracker,
        title: 'ExpenseTracker',
      },
      {
        path: 'add-expense',
        component: AddExpense,
        title: 'addExpense',
      },
    ],
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'page not found 404',
  },
];
