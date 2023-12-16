"use client";

import { COLOR_EXTENSION_MAP } from "@/constants";
import { FileType } from "@/type";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import { FileIcon, defaultStyles } from "react-file-icon";

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, ...props }) => {
      const type = renderValue() as string;
      const extension: string = type.split("/")[1];
      return (
        <div className="w-10">
          <FileIcon
            extension={extension}
            labelColor={COLOR_EXTENSION_MAP[extension] || "#000000"}
            // @ts-ignore
            {...defaultStyles[extension]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "Filename",
    cell: ({ renderValue, ...props }) => {
      return (
        <p
          className="underline  flex items-center text-blue-500 hover:cursor-pointer"
          onClick={() => {
            console.log("EDIT FILE", (props.row.original as FileType).id);
          }}
        >
          {props.cell.getValue() as string}
          <PencilIcon size={15} className="ml-2" />
        </p>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
    cell: ({ renderValue, ...props }) => {
      return (
        <div className="flex flex-col">
          <div className="text-sm">
            {(props.cell.getValue() as Date).toDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {(props.cell.getValue() as Date).toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue, ...props }) => {
      return <span> {prettyBytes(renderValue() as number)}</span>;
    },
  },
  {
    accessorKey: "downloadUrl",
    header: "Link",
    cell: ({ renderValue, ...props }) => {
      return (
        <a
          href={renderValue() as string}
          target="_blank"
          className="underline text-blue-500 hover:text-blue-600"
        >
          Download
        </a>
      );
    },
  },
];
