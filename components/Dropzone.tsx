"use client";
import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import DropzoneComponent from "react-dropzone";

export default function Dropzone() {
  const MAX_SIZE = 2970020;

  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  const onDropHandler = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("File reading was aborted");
      reader.onerror = () => console.log("File reading has failed");
      reader.onload = async () => {
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadPost = async (selectedFile: File) => {
    if (loading || !user) return;

    setLoading(true);
    const docRef = await addDoc(collection(db, "users", user.id, "files"), {
      userId: user.id,
      filename: selectedFile.name,
      fullName: user.fullName,
      profileImg: user.imageUrl,
      timestamp: serverTimestamp(),
      type: selectedFile.type,
      size: selectedFile.size,
    });
    const fileRef = ref(storage, `users/${user.id}/files/${docRef.id}`);
    uploadBytes(fileRef, selectedFile)
      .then(async (snapshot) => {
        const downloadUrl = await getDownloadURL(fileRef);
        await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
          downloadUrl,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <DropzoneComponent minSize={0} maxSize={MAX_SIZE} onDrop={onDropHandler}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > MAX_SIZE;
        return (
          <section className="m-4">
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                isDragActive
                  ? "bg-[#035FFE] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col">
                {!isDragActive && "Click here or drop a file to upload"}
                {isDragActive && !isDragReject && "Drop to upload this file"}
                {isDragReject && "File type not accepted, sorry!"}
                {isFileLarge && (
                  <span className="text-danger mt-2">File is too large</span>
                )}
              </div>
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
}
