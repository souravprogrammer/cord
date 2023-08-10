import { StateCreator } from "zustand";

export type ActivePageType = "home" | "activity" | "profile";

export interface NavigationType {
  activePage: ActivePageType;
  changePage: (currentPage: ActivePageType) => void;
}

export const createNavigationSlice: StateCreator<NavigationType> = (
  set?: any,
  get?: any,
  something?: any
) => {
  return {
    activePage: "home" as ActivePageType,
    changePage: (currentPage: ActivePageType) => {
      set({ activePage: currentPage });
    },
  };
};

// export const useNavigationHighlite = create((set): NavigationType => {
//   return {
//     activePage: "home" as ActivePageType,
//     changePage: (currentPage: ActivePageType) => {
//       set({ activePage: currentPage });
//     },
//   };
// });
