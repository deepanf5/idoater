import { DoLaterI, Supbase } from './../../services/supbase';
import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { initialForm } from './form-resetState';

@Component({
  selector: 'app-todo-form',
  imports: [FormField],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
})
export class TodoForm {
  protected readonly taskType: string[] = ['Low', 'High', 'Medium'];
  protected taskList = signal<string[]>(this.taskType);
  protected model = signal<DoLaterI>({
    title: '',
    description: '',
    completed: false,
    createdAt: new Date(),
    taskType: '',
  });
  private todoS = inject(Supbase);

  protected doLaterForm = form(this.model, (schema) => {
    required(schema.title, { message: 'Blank tasks are scared of commitment. Give it a title.' });
    required(schema.description, {
      message: 'This task cries silently for a description',
    });
    required(schema.taskType, {
      message: 'You forgot to choose a task type',
    });
    pattern(schema.title, /^[A-Za-z]+(?:\s[A-Za-z]+)*$/, {
      message: 'The title field is allergic to numbers and symbols.',
    });
    minLength(schema.title, 3, { message: 'Nice try. Your title needs at least 3 characters.' });
    maxLength(schema.title, 200, { message: 'Your task title is longer than the task itself ?' });
    minLength(schema.description, 3, {
      message: 'This task cries silently for a description',
    });
    maxLength(schema.description, 250, {
      message: 'This task cries silently for a description',
    });
  });

  protected onSubmitForm(event: SubmitEvent) {
    event.preventDefault();

    if (this.doLaterForm().invalid()) {
      return;
    }

    submit(this.doLaterForm, async () => {
      const formData = this.doLaterForm().value();
      const result = await this.todoS.createTodo(formData);
      if (result.success) {
        this.doLaterForm().reset(initialForm);
      }
    });
  }
}
