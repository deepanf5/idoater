export interface Environment {
  production: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const environment: Environment = {
  production: false,
  supabaseUrl: 'https://hsixzoouujfogsodrkls.supabase.co',
  supabaseAnonKey: 'sb_publishable_tnn3owyQYo7_RJbJLtPBaw_rnLW4ORb',
};
