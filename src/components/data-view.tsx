"use client";
import React from "react";
import { api } from "@/trpc/trpc";
import { DataTable } from "@/components/data-table";
import { formatFileSize } from "@/utils/formatFileSize";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadFile } from "@/lib/utils";

const DataView = () => {
  const { data = [] } = api.file.getUploadedFiles.useQuery();
  const deleteFilesMutation = api.file.deleteFiles.useMutation();
  const utils = api.useUtils();

  const deleteFiles = async (files: string[]) => {
    debugger;
    await deleteFilesMutation.mutateAsync(files);
    await utils.file.invalidate();
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
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
      cell: ({ row }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        new Date(row.original.uploadedAt || "").toLocaleString(),
      enableSorting: true,
    },
    {
      accessorKey: "fileSize",
      header: "File Size",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      cell: ({ row }) => formatFileSize(row.original.fileSize),
      enableSorting: true,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      downloadFile(row.original.filePath);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Icons.download />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={async () => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                await deleteFiles([row.original.id]);
              }}
              variant="destructive"
            >
              <Icons.trash />
            </Button>
          </div>
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} deleteFiles={deleteFiles} />;
};

export default DataView;
