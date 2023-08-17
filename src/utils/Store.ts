import { create } from "zustand";
import { createNavigationSlice, NavigationType } from "./navigationSlice"
import { CreateThreadControllerType, createThreadController } from "./threadSlice";

export type StoreState = NavigationType & CreateThreadControllerType
export const useStore = create<StoreState>((set: any, get: any, s: any) => {
    return {
        ...createNavigationSlice(set, get, s),
        ...createThreadController(set, get, s)
    }
})
