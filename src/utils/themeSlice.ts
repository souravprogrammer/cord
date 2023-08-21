import { StateCreator } from "zustand";


type Mode = "dark" | "light"
export type Theme = {
    themeMode: Mode,
    setThemeMode: (mode: Mode) => void
}
export const createThemeMode: StateCreator<Theme> = (
    set?: any,
    get?: any,
    something?: any
) => {
    return {
        themeMode: typeof window !== "undefined" ? (() => {
            const mode = localStorage.getItem("theme__")
            if (!mode) {
                localStorage.setItem("theme__", "light")
                return "light"
            } else {
                return localStorage.getItem("theme__")
            }

        })() as Mode : "light",
        setThemeMode: (mode: Mode): void => {
            set({ themeMode: mode });
            document.cookie = "theme=" + mode
            localStorage.setItem("theme__", mode);
        },

    };
};
