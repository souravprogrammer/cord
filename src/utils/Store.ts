import { create } from "zustand";
import { createNavigationSlice, NavigationType } from "./navigationSlice"

export type StoreState = NavigationType
export const useStore = create<StoreState>((set, get, s) => {
    return {
        ...createNavigationSlice(set, get, s)
    }
})
