import { Injectable, signal } from '@angular/core';
import { supabase } from '../app.config';
import { from, Observable } from 'rxjs';
import { AuthResponse } from '@supabase/supabase-js';

export enum loginStatus {
  status = 'SIGNED_IN',
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  userData = signal<any>({});
  userId = signal<string>('');

  constructor() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === loginStatus.status) {
        this.userData.set(session?.user.user_metadata);
        this.userId.set(session?.user.id ?? '');
      }
    });
  }

  signUp(email: string, password: string, userName: string): Observable<AuthResponse> {
    const promise = supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          userName: userName,
        },
      },
    });
    return from(promise);
  }

  signIn(email: string, password: string) {
    const promise = supabase.auth.signInWithPassword({
      email,
      password,
    });
    return from(promise);
  }

  signOut() {
    supabase.auth.signOut();
  }
}
