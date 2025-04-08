import { create } from "zustand";

type CommentFormView = {
  commentsViewId: number | null;
  toggleFormView: (id: number) => void;
  commentsViewOff: () => void;
};

type CommentPasswordForm = {
  passwordFomView: number | null;
  setPasswordFormId: (id: number) => void;
  commentsPasswordFormOff: () => void;
};

// Toggle Form
const toggleForm = (
  set: (fn: (state: CommentFormView) => Partial<CommentFormView>) => void
) => {
  return {
    commentsViewId: null,
    toggleFormView: (id: number) =>
      set((state) => ({
        commentsViewId: state.commentsViewId === id ? null : id,
      })),
    commentsViewOff: () =>
      set(() => ({
        commentsViewId: null,
      })),
  };
};

// Toggle Password Form
const togglePasswordForm = (
  set: (
    fn: (state: CommentPasswordForm) => Partial<CommentPasswordForm>
  ) => void
) => {
  return {
    passwordFomView: null,
    setPasswordFormId: (id: number) =>
      set((state) => ({
        passwordFomView: state.passwordFomView === id ? null : id,
      })),
    commentsPasswordFormOff: () =>
      set(() => ({
        passwordFomView: null,
      })),
  };
};

//전체 타입
type StoreCreate = {} & CommentFormView & CommentPasswordForm;
const useStore = create<StoreCreate>((set) => ({
  ...toggleForm(set),
  ...togglePasswordForm(set),
}));

export default useStore;
