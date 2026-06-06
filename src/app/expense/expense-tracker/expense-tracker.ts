import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Expense } from '../../services/expense';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  protected expensesList = signal<ExpenseI[]>([]);
  protected total = signal<number>(0);
  protected thisMonth = signal<number>(0);
  private toastr = inject(ToastrService);
  protected isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getExpenseList();
  }

  removeExpense(id: number) {
    this.expenseS.removeExpenseById(id).subscribe({
      next: (res) => {
        if (res.status === 200 && res.success) {
          this.expenseRemoved();
          this.getExpenseList();
        } else {
          this.showError();
        }
      },
      error: (err: Error) => {
        console.log(err.message);
      },
    });
  }

  getExpenseList() {
    this.isLoading.set(true);
    this.expenseS.getExpenseList().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status === 200 && res.success === true) {
          this.expensesList.set([...res.data]);
          this.total.set(this.expensesList().reduce((acc, item) => item.amount + acc, 0));
          this.currentMonth();
        } else {
          this.showError();
        }
      },
      error: (err: Error) => {
        console.error(err.message);
        this.showError();
        this.isLoading.set(false);
      },
    });
  }

  currentMonth() {
    this.expenseS.getThisMonthExpense().subscribe({
      next: (res) => {
        if (res.data) {
          this.thisMonth.set([...res.data].reduce((acc, item) => item.amount + acc, 0));
        }
      },
      error: (err: Error) => {
        console.log(err);
        this.showError();
      },
    });
  }

  showSuccess() {
    this.toastr.success('Success Expense updated. Wallet status refreshed');
  }

  expenseRemoved() {
    this.toastr.success('Success Expense Removed. Wallet status refreshed');
  }
  showError() {
    this.toastr.error('Error Expenses refused to show or update');
  }
}
