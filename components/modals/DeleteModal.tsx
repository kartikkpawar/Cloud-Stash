"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db, storage } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import toast from "react-hot-toast";

export function DeleteModal() {
  const [setIsDeleteModalOpen, isDeleteModalOpen, fileId] = useAppStore(
    (state) => [
      state.setIsDeleteModalOpen,
      state.isDeleteModalOpen,
      state.fileId,
    ]
  );
  const { user } = useUser();

  const deleteFile = async () => {
    if (!user || !fileId) return;
    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
    const toastId = toast.loading("Deleting file...");

    try {
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "users", user.id, "files", fileId));
      toast.success("File deleted successfully...", {
        id: toastId,
      });
    } catch (error) {
      console.log("Something went wrong", error);
      toast.error("Something went  wrong! Pls try again", {
        id: toastId,
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            file!
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span className="">Cancel</span>
          </Button>
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="destructive"
            onClick={deleteFile}
          >
            <span className="sr-only">Delete</span>
            <span className="">Delete</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
