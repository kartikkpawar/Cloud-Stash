import { create } from "zustand";

interface AppState {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;

  isEditModalOpen: boolean;
  setIsEditModal: (open: boolean) => void;

  fileId: string | null;
  setFileId: (fileId: string) => void;

  filename: string | null;
  setFilename: (filename: string) => void;

  filePassword: string | null;
  setFilePassword: (password: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  fileId: null,
  setFileId: (fileId: string) => set((state) => ({ fileId })),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (open: boolean) =>
    set((state) => ({ isDeleteModalOpen: open })),

  isEditModalOpen: false,
  setIsEditModal: (open: boolean) =>
    set((state) => ({ isEditModalOpen: open })),

  filename: "",
  setFilename: (filename: string) => set((state) => ({ filename })),

  filePassword: "",
  setFilePassword: (filePassword: string) => set((state) => ({ filePassword })),
}));
