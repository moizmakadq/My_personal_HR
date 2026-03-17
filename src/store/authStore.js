import { create } from "zustand";
import { DEMO_ACCOUNTS, ROLES } from "@/config/constants";
import demoData from "@/config/demoData";
import { isDemoMode, supabase } from "@/config/supabase";
import { useStudentStore } from "@/store/studentStore";

const STORAGE_KEY = "placeright-auth";

const resolveRoute = (role) => {
  if (role === ROLES.ADMIN) return "/admin";
  if (role === ROLES.INTERVIEWER) return "/interviewer";
  return "/student";
};

const getDemoProfile = (email) =>
  demoData.profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase()) || null;

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildFallbackProfile = (user, emailOverride = "") => ({
  id: user?.id || null,
  email: emailOverride || user?.email || "",
  full_name: user?.user_metadata?.full_name || "User",
  role: user?.user_metadata?.role || ROLES.STUDENT
});

const getSupabaseProfile = async (user, emailOverride = "") => {
  if (!user?.id || !supabase) {
    return buildFallbackProfile(user, emailOverride);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("Failed to fetch profile from Supabase, falling back to auth metadata.", error);
    return buildFallbackProfile(user, emailOverride);
  }

  if (data) {
    return {
      id: data.id,
      email: data.email || emailOverride || user.email || "",
      full_name: data.full_name || user.user_metadata?.full_name || "User",
      role: data.role || user.user_metadata?.role || ROLES.STUDENT
    };
  }

  return buildFallbackProfile(user, emailOverride);
};

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: false,
  initialized: false,
  demoMode: isDemoMode,
  initializeAuth: async () => {
    if (get().initialized) return;

    if (isDemoMode) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        set({ ...parsed, initialized: true });
      } else {
        set({ initialized: true });
      }
      return;
    }

    set({ loading: true });
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await getSupabaseProfile(session.user);
      set({
        session,
        user: session.user,
        profile,
        initialized: true,
        loading: false
      });
    } else {
      set({ initialized: true, loading: false });
    }
  },
  signIn: async ({ email, password }) => {
    set({ loading: true });
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      set({ loading: false });
      throw new Error("Enter a valid email address.");
    }

    if (!String(password || "").trim()) {
      set({ loading: false });
      throw new Error("Enter your password.");
    }

    if (isDemoMode) {
      const account = Object.values(DEMO_ACCOUNTS).find(
        (candidate) => candidate.email === normalizedEmail && candidate.password === password
      );
      if (!account) {
        set({ loading: false });
        throw new Error("Invalid demo credentials.");
      }
      const profile = getDemoProfile(normalizedEmail);
      const user =
        account.role === ROLES.STUDENT
          ? useStudentStore.getState().students.find((student) => student.email === normalizedEmail) || {
              id: profile.id,
              email: normalizedEmail
            }
          : { id: profile.id, email: normalizedEmail };

      const snapshot = { profile, user, session: { access_token: "demo-session" } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      set({ ...snapshot, loading: false, initialized: true });
      return resolveRoute(account.role);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });
    if (error) {
      set({ loading: false });
      throw error;
    }

    const profile = await getSupabaseProfile(data.user, normalizedEmail);
    set({ user: data.user, session: data.session, profile, loading: false, initialized: true });
    return resolveRoute(profile.role);
  },
  signUp: async ({ fullName, rollNumber, email, password, department, branch }) => {
    set({ loading: true });

    const normalizedEmail = normalizeEmail(email);
    const trimmedName = String(fullName || "").trim();
    const trimmedRollNumber = String(rollNumber || "").trim();
    const trimmedBranch = String(branch || "").trim();

    if (!trimmedName) {
      set({ loading: false });
      throw new Error("Enter your full name.");
    }

    if (!trimmedRollNumber) {
      set({ loading: false });
      throw new Error("Enter your roll number.");
    }

    if (!isValidEmail(normalizedEmail)) {
      set({ loading: false });
      throw new Error("Enter a valid email address.");
    }

    if (String(password || "").length < 6) {
      set({ loading: false });
      throw new Error("Password must be at least 6 characters.");
    }

    if (!trimmedBranch) {
      set({ loading: false });
      throw new Error("Enter your branch.");
    }

    if (isDemoMode) {
      const student = useStudentStore.getState().registerStudent({
        fullName: trimmedName,
        rollNumber: trimmedRollNumber,
        email: normalizedEmail,
        department,
        branch: trimmedBranch
      });
      const profile = {
        id: student.profile_id,
        email: normalizedEmail,
        full_name: trimmedName,
        role: ROLES.STUDENT
      };
      const snapshot = {
        profile,
        user: { id: student.id, email: normalizedEmail },
        session: { access_token: "demo-session" }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      set({ ...snapshot, loading: false, initialized: true });
      return "/student/profile";
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { full_name: trimmedName, role: ROLES.STUDENT } }
    });
    if (error) {
      set({ loading: false });
      throw error;
    }

    const profile = await getSupabaseProfile(data.user, normalizedEmail);
    set({
      user: data.user,
      session: data.session,
      profile,
      loading: false,
      initialized: true
    });
    return resolveRoute(profile.role);
  },
  signOut: async () => {
    if (isDemoMode) {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, profile: null, session: null });
      return "/";
    }
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null });
    return "/";
  }
}));
