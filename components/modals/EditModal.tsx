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
import { Checkbox } from "@/components/ui/checkbox";

export default function EditModal() {
  const [setIsEditModal, isEditModalOpen, fileId, filename] = useAppStore(
    (state) => [
      state.setIsEditModal,
      state.isEditModalOpen,
      state.fileId,
      state.filename,
    ]
  );
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const editFile = async () => {
    if (!fileId || !user) return;
    const toastId = toast.loading("Updating file...");
    try {
      await updateDoc(doc(db, "users", user.id, "files", fileId), {
        filename: input,
        password: showPassword ? passwordInput : "",
      });
      toast.success("File updated successfully...", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Something went  wrong! Pls try again", {
        id: toastId,
      });
    } finally {
      setIsEditModal(false);
    }
  };

  const handlePassword = (e: any) => {
    const value = e.target.value;
    setPasswordInput(value);
  };

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={(isOpen) => {
        setIsEditModal(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-2">Edit File Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          <span>Filename</span>
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
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="password-check"
              className="h-5 w-5"
              checked={showPassword}
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
            <label
              htmlFor="password-check"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password protect file
            </label>
          </div>
          {showPassword && (
            <Input
              id="link"
              type="password"
              placeholder="Enter password"
              onChange={handlePassword}
              value={passwordInput}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  editFile();
                }
              }}
            />
          )}
        </div>
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={() => setIsEditModal(false)}
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
            <span className="sr-only">Update</span>
            <span className="">Update</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
