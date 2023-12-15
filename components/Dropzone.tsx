"use client";
import { cn } from "@/lib/utils";
import React from "react";
import DropzoneComponent from "react-dropzone";

export default function Dropzone() {
  const MAX_SIZE = 270020; //2MB

  return (
    <DropzoneComponent
      minSize={0}
      maxSize={MAX_SIZE}
      onDrop={(acceptedFiles) => console.log(acceptedFiles)}
    >
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
