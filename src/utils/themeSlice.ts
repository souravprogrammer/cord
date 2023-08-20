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
        themeMode: "light",
        setThemeMode: (mode: Mode): void => {
            set({ themeMode: mode });
            localStorage.setItem("theme__", mode);
        },

    };
};
