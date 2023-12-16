"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { PencilIcon, Share2, TrashIcon } from "lucide-react";
import { FileType } from "@/type";
import { useAppStore } from "@/store/store";
import { DeleteModal } from "../modals/DeleteModal";
import EditModal from "../modals/EditModal";
import toast from "react-hot-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [
    setIsDeleteModalOpen,
    setIsEditModal,
    setFileId,
    setFileName,
    setFilePassword,
  ] = useAppStore((state) => [
    state.setIsDeleteModalOpen,
    state.setIsEditModal,
    state.setFileId,
    state.setFilename,
    state.setFilePassword,
  ]);

  const openDeleteModal = (fileId: string) => {
    setIsDeleteModalOpen(true);
    setFileId(fileId);
  };
  const openEditModal = (
    fileId: string,
    fileName: string,
    password?: string
  ) => {
    setIsEditModal(true);
    setFileId(fileId);
    setFileName(fileName);
    if (password) {
      setFilePassword(password);
    }
  };

  const shareFileUrl = async (fileId: string, userId: string) => {
    if (!fileId) return toast.error("Something went wrong");
    const fileUrl = `${process.env.NEXT_PUBLIC_CLOUD_STASH_URL}/view/${userId}/${fileId}`;
    try {
      await navigator.clipboard.writeText(fileUrl);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Something went wrong, Check logs for file url");
      console.log("FILE_URL Visit\n", fileUrl);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead>Delete</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteModal />
                <EditModal />
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "filename" ? (
                      <p
                        className="underline  flex items-center text-blue-500 hover:cursor-pointer"
                        onClick={() => {
                          openEditModal(
                            (row.original as FileType).id,
                            (row.original as FileType).filename,
                            (row.original as FileType)?.password
                          );
                        }}
                      >
                        {cell.getValue() as string}
                        <PencilIcon size={15} className="ml-2" />
                      </p>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                <TableCell key={(row.original as FileType).id}>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      shareFileUrl(
                        (row.original as FileType).id,
                        (row.original as FileType).userId as string
                      );
                    }}
                  >
                    <Share2 size={20} />
                  </Button>
                </TableCell>
                <TableCell key={(row.original as FileType).id}>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      openDeleteModal((row.original as FileType).id);
                    }}
                  >
                    <TrashIcon size={20} className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                You have no files.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
