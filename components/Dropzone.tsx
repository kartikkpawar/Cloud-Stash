"use client";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import DropzoneComponent from "react-dropzone";

export default function Dropzone() {
  const MAX_SIZE = 270020; //2MB

  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  const onDropHandler = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("File reading was aborted");
      reader.onerror = () => console.log("File reading has failed");
      reader.onload = async () => {
        await uploadpost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadpost = async (selectedFiles: File) => {
    if (loading || !user) return;
    setLoading(true);
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
