"use client";
import PasswordModal from "@/components/modals/PasswordModal";
import { db } from "@/firebase";
import { useAppStore } from "@/store/store";
import { FileType } from "@/type";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function SecurePage(props: any) {
  const [setIsPasswordModal] = useAppStore((state) => [
    state.setIsPasswordModal,
  ]);

  const [filePassword, setFilePassword] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!props.params.fileId) return;
    const _fileId = props.params.fileId;
    const _userId = props.params.userId;
    getDoc(doc(db, "users", _userId, "files", _fileId)).then((snapshot) => {
      const data: FileType = snapshot.data() as FileType;

      if (data?.password) {
        setFilePassword(data.password);
        setIsPasswordModal(true);
        setDownloadUrl(data.downloadUrl);
      } else {
        router.replace(data.downloadUrl);
      }
    });

    return () => {
      setFilePassword("");
      setIsPasswordModal(false);
      setDownloadUrl("");
    };
  }, []);

  const redirectHelper = () => {
    router.replace(downloadUrl);
  };

  return (
    <PasswordModal redirect={redirectHelper} filePassword={filePassword} />
  );
}

export default SecurePage;
