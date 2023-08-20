import { create } from "zustand";
import { createNavigationSlice, NavigationType } from "./navigationSlice"
import { CreateThreadControllerType, createThreadController } from "./threadSlice";
import { createThemeMode, Theme } from "./themeSlice";

export type StoreState = NavigationType & CreateThreadControllerType & Theme
export const useStore = create<StoreState>((set: any, get: any, s: any) => {
    return {
        ...createNavigationSlice(set, get, s),
        ...createThreadController(set, get, s),
        ...createThemeMode(set, get, s)
    }
})
