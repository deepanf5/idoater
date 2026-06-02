export interface Environment {
  production: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const environment: Environment = {
  production: false,
  supabaseUrl: 'https://wnxwazezfysadtpzuxkb.supabase.co',
  supabaseAnonKey: 'sb_publishable_A00WTLLttmvYCBHrdCRIkQ_8j5WE_rT',
};
