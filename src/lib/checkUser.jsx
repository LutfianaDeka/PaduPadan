import { supabase } from './supabase';

export const checkUserLoggedIn = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Gagal mendapatkan sesi:', error.message);
    return null;
  }

  if (!data.session) {
    console.log('User belum login.');
    return null;
  }

  // Berhasil login
  console.log('User sedang login:', data.session.user);
  return data.session.user;
};
