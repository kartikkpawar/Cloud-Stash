"use client";

import { useAppStore } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PasswordModal({
  filePassword,
  redirect,
}: {
  filePassword: string;
  redirect: () => void;
}) {
  const [isPasswordModalOpen, setIsPasswordModal] = useAppStore((state) => [
    state.isPasswordModalOpen,
    state.setIsPasswordModal,
  ]);
  const router = useRouter();
  const [passwordInput, setPasswordInput] = useState("");

  const passwordHelper = () => {
    if (passwordInput === filePassword) {
      redirect();
      return;
    }
    toast.error("Password don't match");
  };

  return (
    <Dialog
      open={isPasswordModalOpen}
      onOpenChange={(isOpen) => {
        setIsPasswordModal(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-2">Enter Password</DialogTitle>
        </DialogHeader>
        <Input
          id="link"
          type="password"
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              passwordHelper();
            }
          }}
        />
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={() => {
              setIsPasswordModal(false);
              router.replace("/");
            }}
          >
            <span className="sr-only">Cancel</span>
            <span className="">Cancel</span>
          </Button>
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={passwordHelper}
          >
            <span className="sr-only">Open</span>
            <span className="">Open</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
