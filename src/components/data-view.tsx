"use client";
import React from "react";
import { api } from "@/trpc/trpc";
import { DataTable } from "@/components/data-table";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatDate } from "@/utils/formatDate";
import { Checkbox } from "@/components/ui/checkbox";

const DataView = () => {
  const { data = [] } = api.file.getUploadedFiles.useQuery();

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "filename",
      header: "Filename",
      enableSorting: true,
    },
    {
      accessorKey: "uploadedAt",
      header: "Uploaded At",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      // cell: ({ row }) => formatDate(row.original.uploadedAt),
      enableSorting: true,
    },
    {
      accessorKey: "fileSize",
      header: "File Size",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      cell: ({ row }) => formatFileSize(row.original.fileSize),
      enableSorting: true,
    },
  ];

  return <DataTable data={data} columns={columns} />;
};

export default DataView;
