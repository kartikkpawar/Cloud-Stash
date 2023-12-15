import { FileType } from "@/type";
import React from "react";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./Columns";

function TableWrapper({ skeletonFiles }: { skeletonFiles: FileType[] }) {
  return (
    <div>
      <Button>Sort By...</Button>
      <DataTable data={skeletonFiles} columns={columns} />
    </div>
  );
}

export default TableWrapper;
