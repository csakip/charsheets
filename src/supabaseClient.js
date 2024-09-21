import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project details
const supabaseUrl = "https://bigutqrzxnzzqeplvvae.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZ3V0cXJ6eG56enFlcGx2dmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NTAxNTIsImV4cCI6MjA0MjQyNjE1Mn0.6pkdTOJ8dDalIQYEo4oFpcT5bd1FpYiKTQZ7rYcufV8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw error;
  } else {
    console.log("User signed up:", data.user);
  }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw error;
  } else {
    console.log("User signed in:", data.user);
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  const { error } = supabase.auth.api.resetPasswordForEmail(email);
  if (error) {
    throw error;
  }
}

export async function createCharacterSheet(characterName, attributes) {
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from("character_sheets")
    .insert([{ user_id: user.id, character_name: characterName, attributes }]);

  if (error) console.error("Error creating character sheet:", error);
  else console.log("Character sheet created:", data);
}

export async function fetchCharacterSheets() {
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from("character_sheets")
    .select("*")
    .eq("user_id", user.id);

  if (error) console.error("Error fetching character sheets:", error);
  else console.log("Fetched character sheets:", data);
}

export async function updateCharacterSheet(id, newAttributes) {
  const { data, error } = await supabase
    .from("character_sheets")
    .update({ attributes: newAttributes })
    .eq("id", id);

  if (error) console.error("Error updating character sheet:", error);
  else console.log("Character sheet updated:", data);
}

export async function deleteCharacterSheet(id) {
  const { data, error } = await supabase.from("character_sheets").delete().eq("id", id);

  if (error) console.error("Error deleting character sheet:", error);
  else console.log("Character sheet deleted:", data);
}
