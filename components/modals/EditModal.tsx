"use client";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";

export default function EditModal() {
  const [setIsRenameModalOpen, isRenameModalOpen, fileId, filename] =
    useAppStore((state) => [
      state.setIsRenameModalOpen,
      state.isRenameModalOpen,
      state.fileId,
      state.filename,
    ]);
  const { user } = useUser();
  const [input, setInput] = useState("");

  const editFile = async () => {
    if (!fileId || !user) return;
    const toastId = toast.loading("Renaming file...");
    try {
      await updateDoc(doc(db, "users", user.id, "files", fileId), {
        filename: input,
      });
      toast.success("File renamed successfully...", {
        id: toastId,
      });
    } catch (error) {
      console.log("Something went wrong");
      toast.error("Something went  wrong! Pls try again", {
        id: toastId,
      });
    } finally {
      setIsRenameModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-2">Rename The File</DialogTitle>
        </DialogHeader>
        <Input
          id="link"
          defaultValue={filename || ""}
          onChange={(e) => setInput(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              editFile();
            }
          }}
        />
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={() => setIsRenameModalOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span className="">Cancel</span>
          </Button>
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={editFile}
          >
            <span className="sr-only">Rename</span>
            <span className="">Rename</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
