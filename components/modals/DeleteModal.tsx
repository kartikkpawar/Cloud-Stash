"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db, storage } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

export function DeleteModal() {
  const [setIsDeleteModalOpen, isDeleteModalOpen, fileId] = useAppStore(
    (state) => [
      state.setIsDeleteModalOpen,
      state.isDeleteModalOpen,
      state.fileId,
    ]
  );
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFile = async () => {
    if (!user || !fileId) return;
    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
    try {
      setIsDeleting(true);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "users", user.id, "files", fileId));
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
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
            <span className="sr-only">
              {isDeleting ? "Deleting File" : "Delete"}
            </span>
            <span className="">{isDeleting ? "Deleting File" : "Delete"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
