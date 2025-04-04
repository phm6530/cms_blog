import { create } from "zustand";

type CommentFormView = {
  commentsViewId: number | null;
  toggleFormView: (id: number) => void;
  commentsViewOff: () => void;
};

const useStore = create<CommentFormView>((set) => ({
  commentsViewId: null,
  toggleFormView: (id: number) =>
    set((state) => ({
      commentsViewId: state.commentsViewId === id ? null : id,
    })),
  commentsViewOff: () =>
    set(() => ({
      commentsViewId: null,
    })),
}));

export default useStore;
