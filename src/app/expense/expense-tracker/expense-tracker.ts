import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Expense } from '../../services/expense';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

export interface ExpenseI {
  id: number;
  user_id: string;
  category: string;
  description: string;
  created_at: string;
  amount: number;
}

@Component({
  selector: 'app-expense-tracker',
  imports: [ScrollingModule, DatePipe, TitleCasePipe, CurrencyPipe],
  templateUrl: './expense-tracker.html',
  styleUrl: './expense-tracker.css',
})
export class ExpenseTracker implements OnInit {
  private expenseS = inject(Expense);
  expenses = signal<ExpenseI[]>([]);
  total: number = 0;

  ngOnInit(): void {
    this.getExpenseList();
  }

  removeExpense(id: number) {
    this.expenseS.removeExpenseById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getExpenseList();
      },
      error: (err: Error) => {
        console.log(err.message);
      },
    });
  }

  getExpenseList() {
    this.expenseS.getExpenseList().subscribe({
      next: (res) => {
        if (res.status === 200 && res.success === true) {
          this.expenses.set([...res.data]);
          this.total = this.expenses().reduce((acc, item) => item.amount + acc, 0);
        }
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }
}
