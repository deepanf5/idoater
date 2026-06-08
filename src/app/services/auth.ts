import { UpdatePassword } from './../common/update-password/update-password';
import { Injectable, signal } from '@angular/core';
import { supabase } from '../app.config';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { AuthResponse } from '@supabase/supabase-js';
import { toObservable } from '@angular/core/rxjs-interop';

export enum loginStatus {
  status = 'SIGNED_IN',
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  userData = signal<any>({});
  userId = signal<string>('');
  private authState$ = new BehaviorSubject<any>(null);

  constructor() {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event);
      console.log('session', session);
      if (event === loginStatus.status) {
        this.userData.set(session?.user.user_metadata);
        this.userId.set(session?.user.id ?? '');
      } else if (session?.user) {
        this.userData.set(session.user.user_metadata);
        this.userId.set(session.user.id);
      } else {
        this.userData.set({});
        this.userId.set('');
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

  signIn(email: string, password: string): Observable<any> {
    return from(
      supabase.auth.signInWithPassword({
        email,
        password,
      }),
    );
  }

  signOut() {
    return from(supabase.auth.signOut());
  }

  async getUser() {
    return await supabase.auth.getUser();
  }

  sentResetLink(email: string): Observable<any> {
    const supabasePromise = supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://idolater.vercel.app/#/update-password',
    });
    return from(supabasePromise);
  }

  updatePassword(password: string): Observable<any> {
    const supabasePromise = supabase.auth.updateUser({
      password: password,
    });
    return from(supabasePromise);
  }

  get authEvents$() {
    return this.authState$.asObservable();
  }
}
