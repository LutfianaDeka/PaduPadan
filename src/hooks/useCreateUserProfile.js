// src/hooks/useCreateUserProfile.js
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useCreateUserProfile() {
  useEffect(() => {
    const createProfileIfNotExists = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;

      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (!existingUser) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email.split("@")[0] ||
          "User";
        const picture =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null;

        const { error: insertError } = await supabase.from("users").insert({
          user_id: user.id,
          username: name,
          email: user.email,
          profile_picture: picture,
        });

        if (insertError) {
          console.error("Gagal membuat profil user:", insertError.message);
        }
      }
    };

    createProfileIfNotExists();
  }, []);
}
