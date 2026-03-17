import { create } from "zustand";

const THEME_KEY = "placeright-theme";

const initialTheme = localStorage.getItem(THEME_KEY) || "light";
document.documentElement.classList.toggle("dark", initialTheme === "dark");

export const useUiStore = create((set, get) => ({
  theme: initialTheme,
  sidebarOpen: true,
  mobileNavOpen: false,
  selectedDriveId: null,
  selectedStudentId: null,
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  toggleMobileNav: () => set({ mobileNavOpen: !get().mobileNavOpen }),
  selectDrive: (selectedDriveId) => set({ selectedDriveId }),
  selectStudent: (selectedStudentId) => set({ selectedStudentId })
}));
