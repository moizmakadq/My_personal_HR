import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    role: store.profile?.role || null,
    isAuthenticated: Boolean(store.user)
  };
};

export default useAuth;
