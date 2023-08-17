import { Thread } from "@/Type";
import { StateCreator } from "zustand";
export type CreateThreadControllerType = {
    openThreadModal: boolean;
    setOpenThreadModal: (action: boolean) => void;
    thread: Thread | null;
    setThread: (thread: Thread | null) => void;
}
export const createThreadController: StateCreator<CreateThreadControllerType> = (
    set?: any,
    get?: any,
    something?: any
) => {
    return {
        openThreadModal: false,
        thread: null,
        setOpenThreadModal: (action: boolean) => {
            set({ openThreadModal: action });
        },
        setThread: (thread: Thread | null) => {
            set({ thread: thread })

        }
    };
};
