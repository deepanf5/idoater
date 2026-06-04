import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  max,
  MAX,
  maxLength,
  min,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { Expense } from '../../services/expense';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface expenseI {
  category: string;
  description: string;
  amount: number;
  created_at: Date;
}

@Component({
  selector: 'app-add-expense',
  imports: [FormField],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  protected readonly expenseCategory = signal<string[]>([
    'Food',
    'Swiggy',
    'Zepto',
    'Insta Mart',
    'Udemy',
    'Other Course',
    'Mobile Recharge',
    'Uber',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Rent',
    'Healthcare',
    'Education',
    'Travel',
    'Insurance',
    'Personal Care',
    'Gifts & Donations',
    'Investments',
    'Taxes',
    'Subscriptions',
    'other',
  ]);

  protected model = signal<expenseI>({
    category: '',
    description: '',
    amount: 0,
    created_at: new Date(),
  });

  private expeneseS = inject(Expense);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  protected expenseForm = form(this.model, (schema) => {
    required(schema.category, {
      message: 'Pick a category to tame your spending!',
    });
    required(schema.description, {
      message: 'This Expense cries silently for a description',
    });
    required(schema.amount, {
      message: 'This expense is invisible without an amount',
    });

    min(schema.amount, 1, { message: 'Money cant appear from thin air — enter an amount' });
    max(schema.amount, 9999999, { message: 'Even the bank raises an eyebrow at that number' });

    minLength(schema.description, 20, {
      message: 'Tiny description alert! Expand your thoughts',
    });
    maxLength(schema.description, 40, {
      message: 'This is a description, not a Netflix script 😁',
    });
  });

  onSubmitForm(event: SubmitEvent) {
    event.preventDefault();

    if (this.expenseForm().invalid()) {
      return;
    }

    submit(this.expenseForm, async () => {
      const formData = this.expenseForm().value();
      this.expeneseS.addExpense(formData).subscribe({
        next: (res) => {
          if (res.status === 201 && res.success === true) {
            this.showSuccess();
            this.router.navigate(['home/expenseTracker']);
          }
        },
        error: (err: Error) => {
          this.showError();
        },
      });
    });
  }

  showSuccess() {
    this.toastr.success('Success Expense updated. Wallet status refreshed');
  }
  showError() {
    this.toastr.error('Error Expenses refused to show');
  }
}
