import { Component, inject, OnInit, signal } from '@angular/core';
import { DoLaterI, Supbase } from '../../services/supbase';
import {
  form,
  FormField,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { initialForm } from '../todo-form/form-resetState';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-todo',
  imports: [FormField],
  templateUrl: './edit-todo.html',
  styleUrl: './edit-todo.css',
})
export class EditTodo implements OnInit {
  protected readonly taskType: string[] = ['Low', 'High', 'Medium'];
  protected taskList = signal<string[]>(this.taskType);
  protected model = signal<DoLaterI>({
    title: '',
    description: '',
    completed: false,
    createdAt: new Date(),
    taskType: '',
  });
  data = signal<any>(null);
  private activRoute = inject(ActivatedRoute);
  private todoS = inject(Supbase);
  private id = signal<number>(0);
  private router = inject(Router);

  ngOnInit(): void {
    const formData = this.activRoute.snapshot.data['todo'].data;
    this.id.set(formData.id);

    this.model.set({
      title: formData.title,
      description: formData.description,
      completed: formData.completed,
      createdAt: formData.created_at,
      taskType: formData.task_type,
    });
  }

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
    minLength(schema.description, 100, {
      message: 'This task cries silently for a description',
    });
    maxLength(schema.description, 850, {
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
      const result = await this.todoS.updateTodo(formData, this.id());
      if (result.success) {
        this.doLaterForm().reset(initialForm);
        this.router.navigate(['/home']);
      }
    });
  }
}
