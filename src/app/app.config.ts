import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { createClient } from '@supabase/supabase-js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
  ],
};
