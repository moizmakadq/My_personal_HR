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
      set({
        session,
        user: session.user,
        profile: {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || "User",
          role: session.user.user_metadata?.role || ROLES.STUDENT
        },
        initialized: true,
        loading: false
      });
    } else {
      set({ initialized: true, loading: false });
    }
  },
  signIn: async ({ email, password }) => {
    set({ loading: true });
    if (isDemoMode) {
      const account = Object.values(DEMO_ACCOUNTS).find(
        (candidate) => candidate.email === email && candidate.password === password
      );
      if (!account) {
        set({ loading: false });
        throw new Error("Invalid demo credentials.");
      }
      const profile = getDemoProfile(email);
      const user =
        account.role === ROLES.STUDENT
          ? useStudentStore.getState().students.find((student) => student.email === email) || {
              id: profile.id,
              email
            }
          : { id: profile.id, email };

      const snapshot = { profile, user, session: { access_token: "demo-session" } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      set({ ...snapshot, loading: false, initialized: true });
      return resolveRoute(account.role);
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false });
      throw error;
    }
    const profile = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || "User",
      role: data.user.user_metadata?.role || ROLES.STUDENT
    };
    set({ user: data.user, session: data.session, profile, loading: false, initialized: true });
    return resolveRoute(profile.role);
  },
  signUp: async ({ fullName, rollNumber, email, password, department, branch }) => {
    set({ loading: true });
    if (isDemoMode) {
      const student = useStudentStore.getState().registerStudent({
        fullName,
        rollNumber,
        email,
        department,
        branch
      });
      const profile = {
        id: student.profile_id,
        email,
        full_name: fullName,
        role: ROLES.STUDENT
      };
      const snapshot = { profile, user: { id: student.id, email }, session: { access_token: "demo-session" } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      set({ ...snapshot, loading: false, initialized: true });
      return "/student/profile";
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: ROLES.STUDENT } }
    });
    if (error) {
      set({ loading: false });
      throw error;
    }
    set({
      user: data.user,
      session: data.session,
      profile: {
        id: data.user.id,
        email,
        full_name: fullName,
        role: ROLES.STUDENT
      },
      loading: false,
      initialized: true
    });
    return "/student/profile";
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
